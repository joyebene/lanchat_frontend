'use client';

import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  label: string;
  isLoading: boolean;
  onClick?: () => void;
}

export default function Button({ label, isLoading, onClick }: ButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      onClick={onClick}
      className="w-full bg-[#00a884] hover:bg-[#06cf9c] active:scale-[0.98] transition-all text-white font-semibold py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-[#00a884]/20"
    >
      {isLoading ? 'Please wait...' : label}
      <ArrowRight size={20} />
    </button>
  );
}