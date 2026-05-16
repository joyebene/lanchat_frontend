'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  MessageCircle,
  User,
  Wifi,
  Lock,
} from 'lucide-react';
import Link from 'next/link';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-(--background) flex items-center justify-center px-4 relative overflow-hidden">
      
      <div className="w-full max-w-md relative z-10">
        {/* Top Branding */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-(--accent) flex items-center justify-center mx-auto shadow-lg shadow-(--accent)/40">
            <MessageCircle size={40} className="text-(--foreground)" />
          </div>

          <h1 className="text-4xl font-bold text-(--foreground) mt-5 tracking-tight">
            LANCHAT
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Fast & secure LAN messaging
          </p>
        </div>

        {/* Card */}
        <div className="bg-(--sidebar-bg) border border-white/2 rounded-3xl p-8 shadow-2xl">
          
          {/* LAN Status */}
          <div className="flex items-center justify-center gap-2 bg-(--background) text-(--accent) px-4 py-2 rounded-xl mb-6 text-sm">
            <Wifi size={16} />
            Connected to Local Network
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={email}
              placeholder="Enter your email"
              Icon={User}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              placeholder="Enter your password"
              Icon={Lock}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button label="Join Chat" isLoading={isLoading} />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{' '}
              <Link  href="/register" className="text-(--accent) hover:underline font-semibold">
                Register
              </Link>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Chat instantly with users on your LAN network
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}