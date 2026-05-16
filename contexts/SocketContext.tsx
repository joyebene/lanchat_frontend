'use client';
 
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { initiateSocketConnection, disconnectSocket } from '@/lib/api';
import { Socket } from 'socket.io-client';
 
interface SocketContextType {
  socket: Socket | null;
}
 
const SocketContext = createContext<SocketContextType | undefined>(undefined);
 
export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = initiateSocketConnection();
      setSocket(newSocket);

      return () => {
        disconnectSocket();
        setSocket(null);
      };
    } else {
        disconnectSocket();
        setSocket(null);
    }
  }, [isAuthenticated]);
 
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
}
 
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};