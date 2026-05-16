'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Users,
  MessageSquare,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';

export default function Sidebar({
  setView,
  view,
}: {
  setView: (view: string) => void;
  view: string;
}) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-20 bg-[var(--sidebar-bg)] p-4 flex flex-col items-center justify-between border-r border-black/10 dark:border-white/10">
      <div>
        <div className="p-3 bg-[var(--accent)] rounded-full mb-8">
          <MessageSquare size={30} className="text-white" />
        </div>
        <div className="space-y-4">
          <div
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              view === 'group' ? 'bg-gray-200 dark:bg-[#202c33]' : ''
            }`}
            onClick={() => setView('group')}
          >
            <Users
              size={30}
              className={`transition-colors ${
                view === 'group'
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              } group-hover:text-black dark:group-hover:text-white`}
            />
          </div>
          <div
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              view === 'chat' ? 'bg-gray-200 dark:bg-[#202c33]' : ''
            }`}
            onClick={() => setView('chat')}
          >
            <MessageSquare
              size={30}
              className={`transition-colors ${
                view === 'chat'
                  ? 'text-black dark:text-white'
                  : 'text-gray-500 dark:text-gray-400'
              } group-hover:text-black dark:group-hover:text-white`}
            />
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <Settings
          size={30}
          className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer transition-colors"
        />
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