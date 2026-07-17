"use client";
import Image from 'next/image';
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function SignInButton({ isHero = false }: { isHero?: boolean }) {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAdmin = () => {
    if (!session || !session.user?.email) return false;
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',') || [];
    return adminEmails.includes(session.user.email);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (status === "loading") {
    return <div className="bg-slate-700 h-10 w-24 rounded-lg animate-pulse"></div>;
  }

  if (session) {
    if (isHero) {
        return null;
    }
    
    return (
      <div className="relative" ref={dropdownRef}>
        <button 
    onClick={() => setDropdownOpen(!dropdownOpen)} 
    className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-600 hover:border-blue-500 transition-colors">
    <Image 
        src={session.user?.image || `https://placehold.co/40/0f172a/ffffff?text=${session.user?.name?.[0] || 'U'}`} 
        alt="User profile picture"
        width={40}  
        height={40} 
    />
</button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-lg py-1 z-50">
            {isAdmin() ? (
              <Link href="/admin" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">Admin Dashboard</Link>
            ) : (
              <Link href="/join" className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700">My Application</Link>
            )}
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-700"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }
  
  const buttonClasses = isHero 
    ? "inline-block text-white font-bold text-lg px-8 py-3 rounded-lg transition-all duration-300 bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]"
    : "bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)] hover:shadow-[0_0_15px_rgba(59,130,246,0.8)]";

  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/join" })}
      className={buttonClasses}
    >
      {isHero ? 'Register to Volunteer' : 'Volunteer Now'}
    </button>
  );
}