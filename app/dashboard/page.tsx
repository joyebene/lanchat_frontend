'use client';

import { useAuth } from '@/contexts/AuthContext';
import ChatLayout from '@/components/chat/ChatLayout';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <ChatLayout>
      <div className="flex-1 flex items-center justify-center text-center bg-(--chat-bg) p-6">
        <div>
          <h2 className="text-3xl font-bold text-(--foreground) break-all">Welcome, {user?.username}</h2>
          <p className="text-gray-400 mt-2">
            Select a chat to start messaging
          </p>
        </div>
      </div>
    </ChatLayout>
  );
}