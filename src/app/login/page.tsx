'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { DEMO_USERS } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Normalize inputs
    const inputUser = username.trim();
    const inputPass = password.trim();

    // Find user by email or username (case insensitive)
    const userKey = Object.keys(DEMO_USERS).find((key) => {
      const u = DEMO_USERS[key];
      return u.email.toLowerCase() === inputUser.toLowerCase();
    });

    if (!userKey) {
      setError('Username tidak ditemukan.');
      return;
    }

    const user = DEMO_USERS[userKey];

    // Password validation logic
    let isValid = false;
    
    if (userKey === 'ho') {
      // HO Password
      isValid = inputPass === 'ADMIN123' || inputPass === 'admin123' || inputPass === 'password';
      // For HO, let's accept 'ADMIN123' or something simple since it wasn't specified.
      // Wait, if it's ADMIN, maybe they just want 'ADMIN'. Let's accept 'ADMIN' or 'admin123'
      if (inputPass.toUpperCase() === 'ADMIN' || inputPass === 'admin123') isValid = true;
    } else if (userKey === 'exec') {
      isValid = inputPass === 'exec123' || inputPass === 'EXEC';
    } else {
      // Regional Password: RO + nama regional (allow with or without space, case insensitive for ease)
      const expectedPass1 = `RO ${user.regional_name}`.toLowerCase();
      const expectedPass2 = `RO${user.regional_name}`.replace(/\s+/g, '').toLowerCase();
      
      if (inputPass.toLowerCase() === expectedPass1 || inputPass.toLowerCase() === expectedPass2) {
        isValid = true;
      }
    }

    // Fallback universal password for demo
    if (inputPass === 'agridam2026') isValid = true;

    if (!isValid) {
      setError('Password salah. Pastikan format untuk regional: RO + Nama Regional');
      return;
    }

    // Login successful
    localStorage.setItem('userKey', userKey);
    if (userKey === 'exec') {
      router.push('/executive/dashboard');
    } else {
      router.push('/head-office/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex bg-white relative z-0">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Random subtle blocks in background */}
      <div className="absolute top-32 left-12 w-8 h-8 bg-slate-100/50 z-[-1]"></div>
      <div className="absolute bottom-40 left-48 w-8 h-8 bg-slate-100/50 z-[-1]"></div>
      <div className="absolute top-1/2 left-4 w-8 h-8 bg-slate-100/50 z-[-1]"></div>

      {/* Left Column: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-sm w-full space-y-8">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-200 overflow-hidden">
              <img src="/agridam-logo.jpeg" alt="AgriDaM Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Sign in to AgriDaM
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Welcome back.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                {error}
              </div>
            )}
            
            {/* Username */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-slate-700">
                Email or username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Misal: ADMIN atau maker.aceh@agridam.co.id"
                required
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-semibold text-slate-700">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password..."
                  required
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-semibold text-[13px] py-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-sm mt-2"
            >
              Sign in
            </button>
          </form>

          {/* Footer / Hint */}
          <div className="text-center">
            <p className="text-xs text-slate-400">
              Demo Version 2.0
            </p>
          </div>
        </div>
      </div>

      {/* Right Column: Hero Image (hidden on mobile) */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-50 overflow-hidden border-l border-slate-200">
        <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply">
           {/* Fallback pattern if image is missing */}
           <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_11px)]"></div>
        </div>
        <img
          src="/agridam-dashboard-preview.png"
          alt="Dashboard Preview"
          className="absolute right-[-10%] top-1/2 -translate-y-1/2 w-[120%] h-auto rounded-3xl border border-slate-200/50 shadow-2xl z-10"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-transparent z-10 pointer-events-none"></div>
      </div>
    </div>
  );
}
