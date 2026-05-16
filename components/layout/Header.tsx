'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Menu, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export default function Header({
  title,
  onMenuToggle,
}: HeaderProps) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-(--accent) rounded-full lg:hidden">
            <Image
              src="/lan-logo.jpeg"
              alt="Lanchat"
              width={20}
              height={20}
              className="rounded-full"
            />
          </div>

          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 ml-2 lg:hidden">
            <button
              onClick={onMenuToggle}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              {<Menu
                size={24}
                className="text-gray-600 dark:text-gray-400"
              />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}