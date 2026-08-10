"use client";
import Image from 'next/image'; 
import type { NextPage } from 'next';
import React, { useState , useEffect } from 'react';
import Link from 'next/link';
import SignInButton from '../components/SignInButton';
//.........SHARED COMPONENTS.......
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import PlexusBackground from '../components/PlexusBackground';

// ----- Social Media Icons -----
const CommudleIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="M15.5 8.5c-1.5 0-2.5 1-2.5 2.5s1 2.5 2.5 2.5c.75 0 1.5-.5 1.5-1.5"></path><path d="M8.5 15.5c1.5 0 2.5-1 2.5-2.5s-1-2.5-2.5-2.5c-.75 0-1.5.5-1.5 1.5"></path></svg></div>;
const LinkedInIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg></div>;
const InstagramIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.585-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.585-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.585.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.058-1.281.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44 1.441-.645 1.441-1.44-.645-1.44-1.441-1.44z"/></svg></div>;
const WhatsAppIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.687-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.447-4.435-9.884-9.888-9.884-5.448 0-9.886 4.434-9.889 9.885.002 2.024.605 3.928 1.693 5.624l-.448 1.646 1.694-.439z"/></svg></div>;
const YouTubeIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg></div>;
const XIcon = () => <div className="w-10 h-10 flex items-center justify-center bg-black rounded-full"><svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.299 1.634 4.217 3.797 4.66-1.13.308-2.323.343-3.522.124.616 1.956 2.413 3.38 4.545 3.42-1.77 1.39-3.995 2.22-6.417 2.22-1.053 0-2.08-.062-3.1- .182 2.29 1.47 5.013 2.33 7.94 2.33 9.525 0 14.737-7.89 14.737-14.737 0-.225-.005-.45-.014-.673.998-.722 1.863-1.625 2.557-2.65z"/></svg></div>;


// ===================================================================================
// ----- 2. REUSABLE PAGE LAYOUT (The new, improved part!) -----
// ===================================================================================

interface PageLayoutProps {
    children: React.ReactNode;
    activePage: 'home' | 'team' | 'about' | 'connect';
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, activePage }) => {
    const [isMenuOpen] = useState(false);

    const navLinks = [
        { href: '/', name: 'HOME', page: 'home' },
        { href: '/team', name: 'TEAM', page: 'team' },
        { href: '/about', name: 'ABOUT US', page: 'about' },
        { href: '/connect', name: 'CONNECT WITH US', page: 'connect' },
    ];

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans antialiased overflow-x-hidden">
            <CursorSpotlight />
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900"></div>
                <PlexusBackground />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="md:hidden absolute top-24 left-0 w-full bg-slate-900/80 backdrop-blur-lg z-40">
                        <div className="flex flex-col items-center space-y-4 py-8">
                            {navLinks.map(link => (
                                <Link key={link.name} href={link.href} className={`text-lg font-medium ${activePage === link.page ? "text-blue-400" : "hover:text-blue-400"}`}>
                                    {link.name}
                                </Link>
                            ))}
                            <SignInButton />
                        </div>
                    </div>
                )}
                <div className="flex-grow">
                    {children}
                </div>
                
                <Footer />
            </div>
        </div>
    );
};



//....... 3. THE CONNECT PAGE (Now using the shared layout) ......


const ConnectPage: NextPage = () => {
    useEffect(() => {
        document.title = 'Connect With Us | MLSA MIET Chapter';
    }, []);

    const socialLinks = [
        { name: 'Commudle', href: 'https://www.commudle.com/communities/microsoft-learn-student-ambassadors-meerut-institute-of-engineering-and-technology', icon: <CommudleIcon /> },
        { name: 'LinkedIn', href: 'https://www.linkedin.com/company/mlsa-miet/', icon: <LinkedInIcon /> },
        { name: 'Instagram', href: 'https://www.instagram.com/mlsamiet/', icon: <InstagramIcon /> },
        { name: 'WhatsApp Group', href: 'https://chat.whatsapp.com/JgCZxdUyAHxEOtXFNWYwBO?mode=ac_t', icon: <WhatsAppIcon /> },
        { name: 'YouTube', href: 'https://www.youtube.com/@mlsamiet', icon: <YouTubeIcon /> },
        { name: 'X (Twitter)', href: 'https://x.com/MlsaMiet', icon: <XIcon /> },
    ];

    return (
        <PageLayout activePage="connect">
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto">
                    <div className="text-center mb-8">
                        
                <Image
                  src="/mlsa-logo.png"
                  alt="MLSA MIET Logo"
                  width={112}  // matches w-28 (28 × 4px = 112px)
                  height={112} // matches h-28
                  className="mx-auto mb-4"
                  priority
                />
                        <h1 className="text-3xl font-bold text-white">MLSA MIET</h1>
                        <p className="text-slate-300 mt-1">A community of student leaders building a better tomorrow.</p>
                    </div>

                    <div className="space-y-4">
                        {socialLinks.map(link => (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-4 p-2 bg-slate-800/60 border border-slate-700 rounded-full hover:bg-slate-700/80 hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
                            >
                                {link.icon}
                                <span className="font-semibold flex-grow text-left text-slate-100">{link.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </PageLayout>
    );
};

export default ConnectPage;
