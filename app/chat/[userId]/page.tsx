'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { chatApi, fileApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import ChatLayout from '@/components/chat/ChatLayout';
import CallView from '@/components/call/CallView';
import Link from 'next/link';
import { ArrowLeft, Phone, Send, Video, Paperclip, PhoneIncoming, X } from 'lucide-react';
interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    username: string;
  };
  createdAt: string;
  isMedia?: boolean;
}

export default function ChatPage({ params }: { params: Promise<{ userId: string }>; }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
  const [typingUsername, setTypingUsername] = useState<string | null>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [isCaller, setIsCaller] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { userId } = React.use(params);
  

  const roomId = userId; // Assuming the userId is the roomId for simplicity

  useEffect(() => {
    if (!socket || !roomId) return;

    const fetchHistory = async () => {
      try {
        const { data } = await chatApi.getHistory(roomId);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };
    fetchHistory();

    const handleNewMessage = (newMessage: Message) => {
      // Prevent adding duplicate messages from optimistic updates
      if (newMessage.sender.id !== user?.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    const handleTyping = ({ username, isTyping }: { username: string; isTyping: boolean }) => {
      if (isTyping) {
        setTypingUsername(username);
      } else {
        setTypingUsername(null);
      }
    };

    const handleIncomingSignal = ({ fromUserId, signal }: { fromUserId: string, signal: any }) => {
      if (signal.offer) {
        setIncomingCall({ fromUserId, signal });
      }
    };

    socket.on('message:new', handleNewMessage);
    socket.on('typing', handleTyping);
    socket.on('signal:incoming', handleIncomingSignal);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('typing', handleTyping);
      socket.off('signal:incoming', handleIncomingSignal);
    };
  }, [socket, roomId, user?.id]);

  // Effect for sending typing status
  useEffect(() => {
    if (!socket || !roomId) return;

    if (message) {
      // If not already in a typing state, send start typing
      if (!typingTimeoutRef.current) {
        socket.emit('typing', { roomId, isTyping: true });
      }

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout to send stop typing
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', { roomId, isTyping: false });
        typingTimeoutRef.current = null;
      }, 2000); // 2-second delay
    } else {
      // If message is cleared, immediately send stop typing
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
        socket.emit('typing', { roomId, isTyping: false });
      }
    }

    return () => {
      // Cleanup on unmount
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, roomId, socket]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && socket && user) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const { data } = await fileApi.upload(formData);
        const fileUrl = fileApi.getFileUrl(data.filename);

        const newMessage = {
          content: fileUrl,
          roomId,
          isMedia: true, // Add a flag to identify media messages
        };
        socket.emit('message:send', newMessage);
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
  };

  const handleSend = () => {
    if (message.trim() && socket && user) {
      const optimisticMessage: Message = {
        id: Date.now().toString(), // Temporary ID
        content: message,
        sender: {
          id: user.id,
          username: user.username,
        },
        createdAt: new Date().toISOString(),
        isMedia: false,
      };
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

      socket.emit('message:send', {
        content: message,
        roomId,
      });
      setMessage('');
    }
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    setIsCaller(true);
    setCallType(type);
  };

  const handleAcceptCall = () => {
    if (incomingCall) {
      setIsCaller(false);
      setCallType(incomingCall.signal.offer.video ? 'video' : 'voice');
      // The CallView will now handle the incoming offer
    }
  };

  const handleDeclineCall = () => {
    setIncomingCall(null);
    // Optional: emit a 'call:declined' event to notify the caller
  };

  
  

  if (callType) {
    return (
      <ChatLayout>
        <CallView
          onEndCall={() => setCallType(null)}
          contactName={`User ${userId}`}
          callType={callType}
          targetUserId={userId}
          isCaller={isCaller}
        />
      </ChatLayout>
    );
  }

  return (
    <ChatLayout>
      {incomingCall && (
        <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white p-4 flex justify-between items-center z-50">
          <span>{incomingCall.fromUserId} is calling...</span>
          <div className="space-x-4">
            <button onClick={handleAcceptCall} className="p-2 bg-green-500 rounded-full">
              {<PhoneIncoming size={20} />}
            </button>
            <button onClick={handleDeclineCall} className="p-2 bg-red-500 rounded-full">
              {<X size={20} />}
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col h-full bg-(--chat-bg)">
        {/* Chat Header */}
        <div className="flex items-center justify-between p-4 bg-(--sidebar-bg) border-b border-white/10">
          <div className="flex items-center">
            <Link href="/dashboard">
              <ArrowLeft size={24} className="mr-4 md:hidden" />
            </Link>
            <div className="w-10 h-10 bg-gray-500 rounded-full mr-4"></div>
            <div>
              <h2 className="font-semibold">Chat with User {userId}</h2>
              {typingUsername ? (
                <p className="text-xs text-(--accent) animate-pulse">{typingUsername} is typing...</p>
              ) : (
                <p className="text-xs text-gray-400">online</p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Phone
              size={24}
              className="cursor-pointer hover:text-(--accent)"
              onClick={() => handleStartCall('voice')}
            />
            <Video
              size={24}
              className="cursor-pointer hover:text-(--accent)"
              onClick={() => handleStartCall('video')}
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-4 ${msg.sender.id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-xs lg:max-w-md ${
                  msg.sender.id === user?.id
                    ? 'bg-(--accent) text-white'
                    : 'bg-(--sidebar-bg)'
                }`}
              >
                <p className="font-bold text-sm">{msg.sender.username}</p>
                <p>{msg.isMedia ? <a href={msg.content} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">View File</a> : msg.content}</p>
                <p className="text-xs text-right opacity-70 mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-(--sidebar-bg) border-t border-white/10">
          <div className="relative flex items-center">
            <label htmlFor="file-upload" className="p-2 cursor-pointer">
              <Paperclip size={20} className="text-gray-400" />
            </label>
            <input
              title="file-upload"
              id="file-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="w-full bg-(--chat-bg) border border-transparent focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30 transition-all rounded-full py-3 pl-6 pr-16 text-(--foreground) placeholder:text-gray-500 outline-none"
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              title="send-btn"
              onClick={handleSend}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-(--accent) rounded-full hover:bg-opacity-80"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}