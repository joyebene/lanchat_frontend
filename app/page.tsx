'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wifi, Shield } from 'lucide-react';
import Image from 'next/image';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center animate-fade-in">
        <div className="p-3 mb-8 mx-auto">
           <div className="w-20 h-20 rounded-full bg-(--accent) flex items-center justify-center mx-auto shadow-lg shadow-(--accent)/40 mb-8">
              <Image src="/lan-logo.jpeg" alt="Lanchat" width={50} height={50} className="text-(--foreground) rounded-full mx-auto" />
          </div>
         
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