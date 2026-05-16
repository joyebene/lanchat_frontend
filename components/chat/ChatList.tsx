'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Search } from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function ChatList() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await userApi.getAllUsers();
        setUsers(response.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="h-full overflow-y-auto flex flex-col bg-sidebar-bg border-r border-white/10">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold mb-4">Chats</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background text-foreground placeholder-gray-500 border border-white/20 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {filteredUsers.map((user) => (
          <li key={user.id}>
            <Link href={`/chat/${user.id}`}>
              <div className="flex items-center p-4 hover:bg-white/5 cursor-pointer transition-colors">
                <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
                <div className="flex-1">
                  <h3 className="font-semibold">{user.username}</h3>
                  <p className="text-sm text-gray-400 truncate">
                    Start a conversation
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}