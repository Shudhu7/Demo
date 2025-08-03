// src/components/WebSocketStatus.tsx - Only show when connected
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Wifi } from 'lucide-react';
import { useWebSocketContext } from '@/contexts/WebSocketContext';
import { useAuth } from '@/contexts/AuthContext';

export const WebSocketStatus: React.FC = () => {
  const { isConnected } = useWebSocketContext();
  const { isAuthenticated } = useAuth();

  // Only show when authenticated AND connected
  if (!isAuthenticated || !isConnected) {
    return null;
  }

  return (
    <Badge variant="default" className="flex items-center gap-1">
      <Wifi className="h-3 w-3" />
      Live
    </Badge>
  );
};