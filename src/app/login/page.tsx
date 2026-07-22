'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, Eye } from 'lucide-react';
import { DEMO_USERS, REGIONAL_LIST } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const [selectedUserKey, setSelectedUserKey] = useState<string>('ho');

  const currentUser = DEMO_USERS[selectedUserKey] || DEMO_USERS.ho;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userKey', selectedUserKey);
    router.push('/head-office/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-white relative z-0">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-[-1] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Random subtle blocks in background like ReUI */}
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
            {/* Account Selector (Acting as Email/Username) */}
            <div className="space-y-1.5">
              <label className="block text-[13px] font-semibold text-slate-700">
                Email or username
              </label>
              <div className="relative">
                <select
                  value={selectedUserKey}
                  onChange={(e) => setSelectedUserKey(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 appearance-none shadow-sm transition-colors cursor-pointer"
                >
                  <option value="ho">admin.ho@agridam.co.id (HO Checker)</option>
                  <optgroup label="Akun Regional Maker (CRO 1 - 11)">
                    {REGIONAL_LIST.map((reg) => (
                      <option key={reg.key} value={reg.key}>
                        {reg.name}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-semibold text-slate-700">
                  Password
                </label>
                <button type="button" className="text-[12px] text-slate-500 hover:text-slate-900 font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value="••••••••••••"
                  readOnly
                  className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 shadow-sm"
                />
                <button type="button" className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-slate-900 text-white rounded-xl py-2.5 text-[13px] font-bold shadow-sm hover:bg-slate-800 transition-colors mt-2"
            >
              Sign in
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-[11px] text-slate-400 font-medium">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Social Buttons (Mock) */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button type="button" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.31-.83 3.83-.71 1.64.13 2.9.72 3.69 1.83-3.12 1.87-2.62 6.07.41 7.21-.73 1.81-1.63 3.47-3.01 4.84zm-3.52-14.7c-.55 1.95-2.48 3.53-4.48 3.31.29-2.08 2.05-3.69 4.48-3.31z"/>
                </svg>
                Apple
              </button>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-[12px] text-slate-500">
                Need an account?{' '}
                <button type="button" className="text-slate-900 font-bold hover:underline">
                  Sign up
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>

      {/* Right Column: Graphic/Image */}
      <div className="hidden lg:flex w-1/2 p-6 justify-center items-center">
        {/* Soft blue curved abstract background inside rounded square */}
        <div className="w-full max-w-lg aspect-square bg-[#eaf2f8] rounded-3xl relative overflow-hidden shadow-sm border border-slate-100">
          {/* Abstract SVG shapes mimicking the screenshot */}
          <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M-10,0 C20,30 50,-10 110,60 L110,-10 Z" fill="#ffffff" opacity="0.4" />
            <path d="M-10,110 C40,70 20,20 110,40 L110,110 Z" fill="#ffffff" opacity="0.3" />
            <path d="M0,0 C60,40 20,80 100,100 L0,100 Z" fill="#ffffff" opacity="0.2" />
            
            {/* Soft glowing lines */}
            <path d="M-20,40 C30,90 80,10 120,60" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
            <path d="M10,-20 C50,40 10,90 70,120" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}
