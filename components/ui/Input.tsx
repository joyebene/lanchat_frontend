'use client';

import { LucideIcon } from 'lucide-react';

interface InputProps {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  Icon?: LucideIcon;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  label,
  type,
  value,
  placeholder,
  Icon,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="block text-sm text-gray-500 dark:text-gray-300 mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <Icon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
            size={20}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required
          className={`w-full bg-[var(--background)] border border-gray-300 dark:border-transparent focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30 transition-all rounded-2xl py-3 pr-4 text-[var(--foreground)] placeholder:text-gray-500 outline-none ${
            Icon ? 'pl-12' : 'pl-4'
          }`}
        />
      </div>
    </div>
  );
}