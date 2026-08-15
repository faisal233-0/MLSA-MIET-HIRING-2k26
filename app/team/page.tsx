"use client";
import Link from 'next/link';
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import Image from 'next/image';
//...... SHARED COMPONENTS ......
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import PlexusBackground from '../components/PlexusBackground';



// >>>>>>>>>>>>>>TEAM PAGE COMPONENTS >>>>>>>>>>>>>
const TeamCard = ({ name, role, imageUrl, linkedinUrl }: { name: string, role: string, imageUrl: string, linkedinUrl: string }) => {
    const [isActive, setIsActive] = useState(false);

    // This function will handle the main card tap
    const handleCardClick = () => {
        setIsActive(!isActive);
    };

    // These strings make the className logic cleaner
    const backgroundAnimationClasses = 'group-hover:rotate-[8deg] group-hover:translate-x-2 group-hover:-translate-y-2 opacity-0 group-hover:opacity-100';
    const backgroundAnimationClassesActive = 'rotate-[8deg] translate-x-2 -translate-y-2 opacity-100';

    const backgroundAnimationClasses2 = 'group-hover:-rotate-[8deg] group-hover:-translate-x-2 group-hover:-translate-y-2 opacity-0 group-hover:opacity-100';
    const backgroundAnimationClassesActive2 = '-rotate-[8deg] -translate-x-2 -translate-y-2 opacity-100';

    return (
        <div
            className="group w-full max-w-xs h-96 cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative w-full h-full">
                {/* Background cards for animation */}
                <div className={`absolute top-0 left-0 w-full h-full bg-slate-200 shadow-md rounded-lg transform-gpu transition-transform duration-500 ease-in-out ${backgroundAnimationClasses} ${isActive ? backgroundAnimationClassesActive : ''}`}></div>
                <div className={`absolute top-0 left-0 w-full h-full bg-slate-300 shadow-lg rounded-lg transform-gpu transition-transform duration-500 ease-in-out ${backgroundAnimationClasses2} ${isActive ? backgroundAnimationClassesActive2 : ''}`}></div>

                {/* Top card - always visible */}
                <div className={`relative w-full h-full bg-white rounded-lg p-4 transition-transform duration-500 ease-in-out group-hover:-translate-y-4 shadow-xl overflow-hidden ${isActive ? '-translate-y-4' : ''}`}>
                    <Image
                        src={imageUrl || "/mlsa-logo.png"}
                        alt={name}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                    />
                    {/* Details slide-up panel */}
                    <div className={`absolute bottom-0 left-0 w-full p-4 bg-white transform group-hover:translate-y-0 transition-transform duration-500 ease-in-out ${isActive ? 'translate-y-0' : 'translate-y-full'}`}>
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">{name}</h3>
                                <p className="text-blue-600 font-semibold">{role}</p>
                            </div>
                            <Link
                                href={linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-500 hover:text-blue-700 transition-colors"
                                // Stop the tap on the icon from closing the card
                                onClick={(e) => e.stopPropagation()}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
const TeamSection = ({ title, members }: { title: string, members: { name: string, role: string, imageUrl: string, linkedinUrl: string }[] }) => (
    <div className="mb-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-white relative inline-block pb-2 mb-12">
            {title}
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
        </h2>
        <div className={`gap-x-8 gap-y-24 ${members.length === 1 ? 'flex justify-center' : 'grid grid-cols-1 md:grid-cols-2 justify-items-center'}`}>
            {members.map((member, index) => (
                <TeamCard key={index} {...member} />
            ))}
        </div>
    </div>
);
const teamData = {
    'Leads': [
        { name: 'Vishvdeep Pundir', role: 'Lead', imageUrl: '/Team/Vishvadeep.webp', linkedinUrl: 'https://www.linkedin.com/in/vishvdeep-pundir-5a783a34b?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
        { name: 'Tannu Chaudhry', role: 'Lead', imageUrl: '/Team/Tannu.webp', linkedinUrl: 'https://www.linkedin.com/in/tannu-chaudhary-857348375?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
    ],
    'Head of Operations': [
        { name: 'Yug Jain', role: 'Head of Operations', imageUrl: '/Team/yug jain.webp', linkedinUrl: 'https://www.linkedin.com/in/yug-jain-a0707a212/' },
        { name: 'Arjun Sharma', role: 'Head of Operations', imageUrl: '/Team/Arjun.webp', linkedinUrl: 'https://www.linkedin.com/in/arjun-sharma-22444623b?utm_source=share_via&utm_content=profile&utm_medium=member_android' }
    ],
    'Tech': [
        { name: 'Mohd Faisal', role: 'Tech Head', imageUrl: '/Team/faisal.webp', linkedinUrl: 'https://www.linkedin.com/in/mohd-faisal-31181a2ab/' },
    ],
    'Graphics': [
        { name: 'Tannu Chauhan', role: 'Graphics Head', imageUrl: '/Team/Tanu Chauhan.webp', linkedinUrl: 'https://www.linkedin.com/in/tanu-chauhan-151584323?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
        { name: 'Arpit Sharma', role: 'Graphics Head', imageUrl: '/Team/Arpit_Kumar_Sharma.webp', linkedinUrl: 'https://www.linkedin.com/in/arpit-kumar-sharma2008?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    ],
    'Content': [
        { name: 'Shristi', role: 'Content Head', imageUrl: '/Team/Srishti.webp', linkedinUrl: 'https://www.linkedin.com/in/srishti4125?utm_source=share_via&utm_content=profile&utm_medium=member_android' },
    ],
    'Visuals': [
        { name: 'Arihant Jain', role: 'Visuals Lead', imageUrl: '/Team/arihant.webp', linkedinUrl: 'https://www.linkedin.com/in/arihant-jain-a31a86374?utm_source=share_via&utm_content=profile&utm_medium=member_ios' },
    ],
    'Social': [
        { name: 'Naina Yadav', role: 'Socials Head', imageUrl: '/Team/naina yadav.webp', linkedinUrl: 'https://www.linkedin.com/in/naina-yadav-8307002b5/' },
    ],
    'Outreach': [
        { name: 'Akshara Aggarwal', role: 'Outreach Head', imageUrl: '/Team/Akshara_Agarwal.webp', linkedinUrl: 'https://www.linkedin.com/in/akshara-agarwal-147940378' },
    ],
    'Event': [
        { name: 'Event', role: 'Event Head', imageUrl: '/', linkedinUrl: '' },
    ],
    'Workflow Management': [
        { name: 'Workflow', role: 'Workflow Manager', imageUrl: '/', linkedinUrl: '' },
    ],
};

//.....TEAM PAGE ......

const TeamPage: NextPage = () => {
    useEffect(() => {
        document.title = 'Our Team | MLSA MIET Chapter';
    }, []);

    return (
        <div className="bg-slate-900 text-white min-h-screen font-sans antialiased overflow-x-hidden">
            <CursorSpotlight />
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900"></div>
                <PlexusBackground />
            </div>
            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                    <div className="relative h-[60vh] flex items-center justify-center text-center px-4 overflow-hidden">
                        <div className="absolute inset-0 z-0">
                            <Image
                                src="/events/samarambh.webp"
                                alt="Team Background"
                                fill
                                sizes="100vw"
                                className="object-cover opacity-80"
                                priority // Add priority to load this important image faster
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-500/10 to-transparent"></div>
                        </div>
                        <div className="relative z-10">
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white" style={{ textShadow: '0 4px 20px rgba(59, 130, 246, 0.5)' }}>
                                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"> Avengers</span> of MLSA MIET
                            </h1>
                        </div>
                    </div>

                    <div className="py-20 sm:py-24 px-4">
                        <div className="max-w-5xl mx-auto">
                            {Object.entries(teamData).map(([key, value]) => (
                                <TeamSection key={key} title={key} members={value} />
                            ))}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default TeamPage;
