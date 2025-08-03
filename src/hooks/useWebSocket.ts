import { useEffect, useRef, useState } from 'react';
interface StompFrame {
  body: string;
  headers: { [key: string]: string };
}

interface StompClient {
  connected: boolean;
  activate: () => void;
  deactivate: () => void;
  subscribe: (destination: string, callback: (message: StompFrame) => void) => { unsubscribe: () => void };
  publish: (params: { destination: string; body: string }) => void;
}

interface WebSocketHookReturn {
  client: StompClient | null;
  isConnected: boolean;
  error: string | null;
  subscribe: (destination: string, callback: (message: any) => void) => () => void;
  sendMessage: (destination: string, body: any) => void;
  disconnect: () => void;
}

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useWebSocket = (options: UseWebSocketOptions = {}): WebSocketHookReturn => {
  const {
    url = 'http://localhost:8080/ws',
    autoConnect = true,
    reconnectDelay = 5000,
    maxReconnectAttempts = 5,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<StompClient | null>(null);
  const reconnectAttempts = useRef(0);
  const subscriptions = useRef<Map<string, () => void>>(new Map());

  const connect = async () => {
    if (clientRef.current?.connected) {
      return;
    }

    try {
      // Dynamic import to avoid build issues
      const { Client } = await import('@stomp/stompjs');
      const SockJS = (await import('sockjs-client')).default;

      const client = new Client({
        webSocketFactory: () => new SockJS(url),
        connectHeaders: {
          Authorization: localStorage.getItem('token') ? 
            `Bearer ${localStorage.getItem('token')}` : ''
        },
        debug: (str) => {
          console.log('STOMP Debug:', str);
        },
        reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: () => {
          console.log('WebSocket connected');
          setIsConnected(true);
          setError(null);
          reconnectAttempts.current = 0;
          onConnect?.();
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
          onDisconnect?.();
        },
        onStompError: (frame) => {
          console.error('STOMP Error:', frame);
          setError(frame.headers?.message || 'WebSocket error occurred');
          onError?.(frame);
        },
        onWebSocketError: (event) => {
          console.error('WebSocket Error:', event);
          setError('WebSocket connection error');
          onError?.(event);
        },
        onWebSocketClose: (event) => {
          console.log('WebSocket closed:', event);
          setIsConnected(false);
          
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current++;
            console.log(`Reconnection attempt ${reconnectAttempts.current}/${maxReconnectAttempts}`);
            setTimeout(() => {
              if (clientRef.current && !clientRef.current.connected) {
                clientRef.current.activate();
              }
            }, reconnectDelay);
          }
        }
      });

      clientRef.current = client as StompClient;
      client.activate();
    } catch (err) {
      console.error('Failed to connect to WebSocket:', err);
      setError('Failed to connect to WebSocket. Make sure packages are installed.');
      onError?.(err);
    }
  };

  const disconnect = () => {
    if (clientRef.current) {
      subscriptions.current.forEach(unsubscribe => unsubscribe());
      subscriptions.current.clear();
      
      clientRef.current.deactivate();
      clientRef.current = null;
      setIsConnected(false);
    }
  };

  const subscribe = (destination: string, callback: (message: any) => void) => {
    if (!clientRef.current?.connected) {
      console.warn('WebSocket not connected. Cannot subscribe to:', destination);
      return () => {};
    }

    const subscription = clientRef.current.subscribe(destination, (message: StompFrame) => {
      try {
        const parsedBody = JSON.parse(message.body);
        callback(parsedBody);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        callback(message.body);
      }
    });

    const unsubscribe = () => {
      subscription.unsubscribe();
      subscriptions.current.delete(destination);
    };

    subscriptions.current.set(destination, unsubscribe);
    return unsubscribe;
  };

  const sendMessage = (destination: string, body: any) => {
    if (!clientRef.current?.connected) {
      console.warn('WebSocket not connected. Cannot send message to:', destination);
      return;
    }

    try {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.error('Error sending WebSocket message:', err);
    }
  };

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, []);

  return {
    client: clientRef.current,
    isConnected,
    error,
    subscribe,
    sendMessage,
    disconnect
  };
};