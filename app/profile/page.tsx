"use client";

import ChatLayout from '@/components/chat/ChatLayout';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail, Shield } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <ChatLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </ChatLayout>
    );
  }

  return (
    <ChatLayout showChatList={false} >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 bg-sidebar-bg border-b border-white/10 p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">My Profile</h2>
        </div>

        {/* Profile Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md mx-auto bg-sidebar-bg border border-white/10 rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <Image
                  src={user.avatar || '/default-avatar.png'}
                  alt="User Avatar"
                  layout="fill"
                  className="rounded-full object-cover border-2 border-accent"
                />
              </div>
              <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
              <p className="text-sm text-gray-400">{user.email}</p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center bg-background p-3 rounded-lg">
                <User className="text-gray-400 mr-3" size={20} />
                <span className="text-foreground">{user.username}</span>
              </div>
              <div className="flex items-center bg-background p-3 rounded-lg">
                <Mail className="text-gray-400 mr-3" size={20} />
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center bg-background p-3 rounded-lg">
                <Shield className="text-gray-400 mr-3" size={20} />
                <span className="text-gray-400">Status: {user.status}</span>
              </div>
            </div>

            <div className="mt-8 flex space-x-4">
              <button className="flex-1 bg-accent hover:bg-accent/90 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Edit Profile
              </button>
              <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </ChatLayout>
  );
}