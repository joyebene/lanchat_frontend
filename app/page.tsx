'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Wifi, Shield } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center animate-fade-in">
        <div className="mb-8">
          <MessageCircle size={80} className="text-accent mx-auto mb-4 animate-bounce" />
          <h1 className="text-5xl font-bold text-accent mb-2">LANCHAT</h1>
          <p className="text-muted-foreground text-lg">Local Area Network Chat System</p>
        </div>
        <div className="flex gap-6 justify-center text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Wifi size={16} />
            <span>No Internet Required</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={16} />
            <span>Secure P2P</span>
          </div>
        </div>
      </div>
    </div>
  );
}