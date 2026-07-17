"use client";
import Image from 'next/image';
import type { NextPage } from 'next';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import AdminDashboard from '../components/AdminDashboard'; // We will use the component you provided

// ...... SHARED COMPONENTS ............

const MLSALogo = () => (
     <Image 
        src="/mlsa-logo.png" 
        alt="MLSA MIET Logo" 
        width={96}  // Use numbers for pixels, so 24 * 4 = 96
        height={96} // Use numbers for pixels, so 24 * 4 = 96
        className="w-24 h-24" // Keep your Tailwind classes for styling
    />
);
const CursorSpotlight = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    if (!isMounted) return null;

    return (
        <div 
            className="pointer-events-none fixed inset-0 z-50 transition duration-300"
            style={{
                background: 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.2), transparent 80%)'
            }}
        ></div>
    );
};


// ----- ADMIN PAGE SHELL -----

const AdminPage: NextPage = () => {
  useEffect(() => {
    document.title = 'Admin Dashboard | MLSA MIET Chapter';
  }, []);

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans antialiased">
        <CursorSpotlight />
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="py-2 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 h-24 flex items-center">
          <nav className="flex justify-between items-center max-w-7xl mx-auto w-full">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <MLSALogo />
              <span className="font-bold text-xl tracking-wide">MLSA MIET</span>
            </Link>
            <Link href="/" className="font-semibold text-slate-300 border-2 border-slate-600 rounded-lg px-4 py-2 hover:bg-slate-700 hover:border-slate-500 hover:text-white transition-colors">
                &larr; Back to Home
            </Link>
          </nav>
        </header>

        <main className="flex-grow p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <AdminDashboard />
            </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;