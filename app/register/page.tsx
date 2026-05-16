'use client';

import { useState } from 'react';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  MessageCircle,
  User,
  Mail,
  Lock,
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await authApi.register({ username, email, password });
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--background) flex items-center justify-center px-4 relative overflow-hidden">
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-(--accent) flex items-center justify-center mx-auto shadow-lg shadow-(--accent)/40">
            <MessageCircle size={40} className="text-(--foreground)" />
          </div>
          <h1 className="text-4xl font-bold text-(--foreground) mt-5 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Join LANCHAT and start messaging
          </p>
        </div>

        <div className="bg-(--sidebar-bg) border border-white/2 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Username"
              type="text"
              value={username}
              placeholder="Enter your username"
              Icon={User}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              placeholder="Enter your email"
              Icon={Mail}
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
            <Button label="Register" isLoading={isLoading} />
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <a href="/login" className="text-(--accent) hover:underline font-semibold">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}