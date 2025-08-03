import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from './AuthContext';

interface WebSocketContextType {
  isConnected: boolean;
  error: string | null;
  subscribe: (destination: string, callback: (message: any) => void) => () => void;
  sendMessage: (destination: string, body: any) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();

  const { isConnected, error, subscribe, sendMessage } = useWebSocket({
    autoConnect: isAuthenticated,
    onConnect: () => {
      console.log('WebSocket connected successfully');
    },
    onDisconnect: () => {
      console.log('WebSocket disconnected');
    },
    onError: (error) => {
      console.error('WebSocket error:', error);
    }
  });

  // Subscribe to user-specific notifications only if connected and user exists
  useEffect(() => {
    if (isConnected && user) {
      console.log('Setting up WebSocket subscriptions for user:', user.id);
      
      const unsubscribeBookings = subscribe(`/user/${user.id}/queue/bookings`, (message) => {
        console.log('Booking update:', message);
      });

      const unsubscribeNotifications = subscribe(`/user/${user.id}/queue/notifications`, (message) => {
        console.log('Notification:', message);
      });

      return () => {
        unsubscribeBookings();
        unsubscribeNotifications();
      };
    }
  }, [isConnected, user, subscribe]);

  return (
    <WebSocketContext.Provider value={{ isConnected, error, subscribe, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};