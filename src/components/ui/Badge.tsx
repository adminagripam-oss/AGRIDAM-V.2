import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'danger' | 'neutral' | 'dark';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = ''
}: BadgeProps) {
  const base = 'inline-flex items-center font-bold rounded-full border transition-colors';

  const variants = {
    // Approved -> ONLY GREEN
    success: 'bg-emerald-50 text-emerald-700 border-emerald-300',
    // Reject / Delete / Danger -> ONLY RED
    danger: 'bg-red-50 text-red-700 border-red-300',
    // Basic -> BLACK & WHITE / SLATE
    dark: 'bg-slate-900 text-white border-slate-900',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs'
  };

  return (
    <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}
