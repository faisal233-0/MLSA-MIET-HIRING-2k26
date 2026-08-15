"use client";

import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import JoinForm from '../components/JoinForm';
import Link from 'next/link';
import RegistrationsClosed from '../components/RegsitrationsClosed';
import HiringUpcoming from '../components/HiringUpcoming';
import { getHiringState } from '@/lib/timeline';

import MLSALogo from '../components/MLSALogo';

const JoinPage: NextPage = () => {
  const [hiringState, setHiringState] = useState<'loading' | 'upcoming' | 'active' | 'closed'>('loading');

  useEffect(() => {
    setHiringState(getHiringState());
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans antialiased">
      {/* This page has a simple background to ensure it loads fast after login */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-5 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-800">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <MLSALogo width={50} height={50} className="w-8 h-8" />
              <span className="font-bold text-xl tracking-wide">MLSA MIET</span>
            </Link>
          </nav>
        </header>

        <main className="flex-grow flex items-center justify-center py-12 px-4">
          <div className="max-w-4xl w-full mx-auto bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-12">
            {hiringState === 'loading' && (
              <p className="text-center text-slate-400">Loading...</p>
            )}
            {hiringState === 'upcoming' && <HiringUpcoming />}
            {hiringState === 'active' && <JoinForm />}
            {hiringState === 'closed' && <RegistrationsClosed />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default JoinPage;