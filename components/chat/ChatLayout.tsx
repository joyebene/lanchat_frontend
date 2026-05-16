'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../layout/Sidebar';
import ChatList from './ChatList';


export default function ChatLayout({
  children,
  showChatList = true,
}: {
  children: React.ReactNode;
  showChatList?: boolean;
 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-(--background) text-(--foreground)">
      <div
        className={`md:flex ${
          isMenuOpen ? 'flex' : 'hidden'
        } md:shrink-0`}
      >
        <Sidebar />
        {showChatList && <ChatList />}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="md:hidden p-4 bg-(--sidebar-bg) border-b border-white/10 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            LanChat
          </h2>
          <Menu
            size={30}
            className="cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          />
        </div>
        {children}
      </div>
    </div>
  );
}