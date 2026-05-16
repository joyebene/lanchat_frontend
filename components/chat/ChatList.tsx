'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { userApi } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  username: string;
  email: string;
}

export default function ChatList() {
  const [users, setUsers] = useState<User[]>([]);
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

  const filteredUsers = users.filter(user => user.id !== currentUser?.id);

  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-xl font-bold p-4 border-b border-white/10">Chats</h2>
      <ul>
        {users.map((user) => (
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