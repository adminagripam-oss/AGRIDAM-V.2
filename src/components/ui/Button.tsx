import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'approve' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    // Basic Primary: Black button
    primary: 'bg-slate-900 hover:bg-slate-800 text-white focus:ring-slate-900 shadow-sm',
    // Approved: Solid Green button
    approve: 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-600 shadow-sm',
    // Reject / Delete: Solid Red button
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-600 shadow-sm',
    // Secondary / Outline: Crisp White button with Slate border
    secondary: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 focus:ring-slate-300 shadow-sm',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 focus:ring-slate-300',
    ghost: 'text-slate-700 hover:bg-slate-100 font-medium'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm sm:text-base'
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
