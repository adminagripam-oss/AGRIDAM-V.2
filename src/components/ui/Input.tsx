import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  unit?: string;
  subtext?: string;
}

export function Input({
  label,
  error,
  unit,
  subtext,
  className = '',
  id,
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-black text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-colors ${
            error ? 'border-red-500' : 'border-slate-300 hover:border-slate-400'
          } ${unit ? 'pr-12' : ''} ${className}`}
          {...props}
        />
        {unit && (
          <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-500 pointer-events-none">
            {unit}
          </span>
        )}
      </div>
      {subtext && !error && <p className="text-[10px] text-slate-500">{subtext}</p>}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
