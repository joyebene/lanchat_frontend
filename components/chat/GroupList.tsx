'use client';

import {
  PlusCircle,
  Search,
} from 'lucide-react';
import Link from 'next/link';

const dummyGroups = [
  { id: 'g1', name: 'Design Team', message: 'Alice: Let\'s review the new mockups.', time: '1:15 PM' },
  { id: 'g2', name: 'Frontend Developers', message: 'Bob: I\'ve pushed the latest changes.', time: '12:30 PM' },
  { id: 'g3', name: 'Project Alpha', message: 'Charlie: We need to finalize the requirements.', time: 'Yesterday' },
];

export default function GroupList() {
  return (
    <div className="w-full md:w-80 bg-(--chat-list-bg) p-6 border-r border-white/10">
      <h2 className="text-2xl font-bold mb-6">Groups</h2>
      <div className="relative mb-6">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          size={20}
        />
        <input
          type="text"
          placeholder="Search groups"
          className="w-full bg-(--chat-bg) border border-transparent focus:border-(--accent) focus:ring-2 focus:ring-(--accent)/30 transition-all rounded-full py-3 pl-12 pr-4 text-(--foreground) placeholder:text-gray-500 outline-none"
        />
      </div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-(--foreground)">
          All Groups
        </h3>
        <PlusCircle
          size={20}
          className="text-gray-400 hover:text-white cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        {dummyGroups.map((group) => (
          <Link href={`/chat/${group.id}`} key={group.id}>
            <div className="flex items-center p-3 hover:bg-(--chat-bg) rounded-lg cursor-pointer">
              <div className="w-12 h-12 bg-gray-600 rounded-full mr-4"></div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h4 className="font-semibold">{group.name}</h4>
                  <p className="text-xs text-gray-400">{group.time}</p>
                </div>
                <p className="text-sm text-gray-400 truncate">
                  {group.message}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}