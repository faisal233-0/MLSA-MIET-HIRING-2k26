"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import MLSALogo from './MLSALogo';
import SignInButton from './SignInButton';
import { usePathname } from 'next/navigation';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <header className="py-2 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 h-24 flex items-center">
                <nav className="flex justify-between items-center max-w-7xl mx-auto w-full">
                    <Link href="/" className="flex items-center gap-2 cursor-pointer">
                        <MLSALogo />
                        <span className="font-bold text-xl tracking-wide">MLSA MIET</span>
                    </Link>
                    
                       {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8 font-medium">
                    <Link href="/" className={`transition-colors duration-300 ${pathname === '/' ? 'text-blue-400' : 'hover:text-blue-400'}`}>HOME</Link>
                    <Link href="/team" className={`transition-colors duration-300 ${pathname === '/team' ? 'text-blue-400' : 'hover:text-blue-400'}`}>TEAM</Link>
                    <Link href="/events" className={`transition-colors duration-300 ${pathname === '/events' ? 'text-blue-400' : 'hover:text-blue-400'}`}>EVENTS</Link>
                    <Link href="/about" className={`transition-colors duration-300 ${pathname === '/about' ? 'text-blue-400' : 'hover:text-blue-400'}`}>ABOUT US</Link>
                    <Link href="/connect" className={`transition-colors duration-300 ${pathname === '/connect' ? 'text-blue-400' : 'hover:text-blue-400'}`}>CONNECT WITH US</Link>
                    </div>
                    <div className="hidden md:block">
                        <SignInButton />
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>
                </nav>
            </header>

             {/* Mobile Menu Dropdown */}
             {isMenuOpen && (
              <div className="md:hidden absolute top-24 left-0 w-full bg-slate-900/80 backdrop-blur-lg z-40">
             <div className="flex flex-col items-center space-y-4 py-8">
            <Link href="/" className={`text-lg font-medium transition-colors ${pathname === '/' ? 'text-blue-400' : 'hover:text-blue-400'}`}>HOME</Link>
            <Link href="/team" className={`text-lg font-medium transition-colors ${pathname === '/team' ? 'text-blue-400' : 'hover:text-blue-400'}`}>TEAM</Link>
            <Link href="/events" className={`text-lg font-medium transition-colors ${pathname === '/events' ? 'text-blue-400' : 'hover:text-blue-400'}`}>EVENTS</Link>
            <Link href="/about" className={`text-lg font-medium transition-colors ${pathname === '/about' ? 'text-blue-400' : 'hover:text-blue-400'}`}>ABOUT US</Link>
            <Link href="/connect" className={`text-lg font-medium transition-colors ${pathname === '/connect' ? 'text-blue-400' : 'hover:text-blue-400'}`}>CONNECT WITH US</Link>
            <SignInButton />
           </div>
            </div>
           )}
        </>
    );
};

export default Navbar;