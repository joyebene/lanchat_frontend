'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Users,
  MessageSquare,
  LogOut,
  Sun,
  Moon,
  UserCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Sidebar() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-20 bg-(--sidebar-bg) p-4 flex flex-col items-center justify-between border-r border-black/10 dark:border-white/10">
      <div>
        <div className="p-3 bg-(--accent) rounded-full mb-8">
           <Image src="/lan-logo.jpeg" alt="Lanchat" width={50} height={50} className="text-(--foreground) rounded-full" />
        </div>
        <div className="space-y-4">
          <div
            className="p-3 rounded-full cursor-pointer transition-colors
              bg-gray-200 dark:bg-[#202c33]"
          >
            <Link href="/dashboard">

            <MessageSquare
              size={20}
              className="transition-colors text-black dark:text-white
           group-hover:text-black dark:group-hover:text-white mx-auto"
            />
              </Link>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <Link href="/profile">
          <UserCircle
            size={30}
            className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
          />
        </Link>
        </div>
        
        <div onClick={toggleTheme} className="cursor-pointer">
          <Sun className="hidden dark:block text-gray-400 hover:text-white transition-colors" size={30} />
          <Moon className="block dark:hidden text-gray-500 hover:text-black transition-colors" size={30} />
        </div>
        <LogOut
          size={30}
          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
          onClick={logout}
        />
      </div>
    </div>
  );
}