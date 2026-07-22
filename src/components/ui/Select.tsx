import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  subtext?: string;
  children: React.ReactNode;
}

export function Select({
  label,
  error,
  subtext,
  children,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
          error ? 'border-red-500' : 'border-slate-300 hover:border-slate-400'
        } ${className}`}
        {...props}
      >
        {children}
      </select>
      {subtext && !error && <p className="text-[10px] text-slate-500">{subtext}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
