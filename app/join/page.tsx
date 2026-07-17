import type { NextPage } from 'next';
import React from 'react';
import JoinForm from '../components/JoinForm'; 
import Link from 'next/link';
import RegistrationsClosed from '../components/RegsitrationsClosed';

// A simple logo component for the header
const MLSALogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const JoinPage: NextPage = () => {
  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans antialiased">
      {/* This page has a simple background to ensure it loads fast after login */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900"></div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-5 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-800">
          <nav className="flex justify-between items-center max-w-7xl mx-auto">
            <Link href="/" className="flex items-center space-x-3 cursor-pointer">
              <MLSALogo />
              <span className="font-bold text-xl tracking-wide">MLSA MIET</span>
            </Link>
          </nav>
        </header>
    
        <main className="flex-grow flex items-center justify-center py-12 px-4">
            <div className="max-w-4xl w-full mx-auto bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-12">
                {/* All the complex logic is inside this component */}
                <RegistrationsClosed />
            </div>
        </main>
      </div>
    </div>
  );
};

export default JoinPage;