'use client';

import { useState } from 'react';
import Header from '../layout/Header';
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
    <div className="flex h-screen bg-(--background) text-(--foreground) overflow-x-hidden">
      <div
        className={`md:flex ${isMenuOpen ? 'flex' : 'hidden'
          } md:shrink-0`}
      >
        <Sidebar />
        {showChatList && <ChatList setIsMenuOpen={setIsMenuOpen} />}
      </div>
      <div className="flex-1 flex flex-col">
        <Header
          title="LanChat"
          onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        />
        {children}
      </div>
    </div>
  );
}