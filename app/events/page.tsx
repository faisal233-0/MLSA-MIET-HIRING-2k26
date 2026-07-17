"use client";
import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

//...... SHARED COMPONENTS ......
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import PlexusBackground from '../components/PlexusBackground';
import SignInButton from '../components/SignInButton';

// .......... TYPE DEFINITIONS ..........
type Event = {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  link: string;
  registrationType?: 'signin' | 'link'; 
};

// .......... EVENT DATA ..........
const upcoming: Event[] = [
  {
    id: "registration",
    title: "Volunteer Registrations Open",
    date: "September 3, 2025",
    time: "19 days",
    location: "Online",
    description: "Register now to begin your journey and join the MLSA MIET team as a volunteer.",
    link: "/join",
    registrationType: 'signin', 
  },
];

const past: Event[] = [
     {

        id: "tech-challenge",

        title: "60 sec Tech Video Challenge",

        date: "Aug 3, 2025",

        time: "24 hrs",

        location: "Online",

        description: "Showcase your skills by explaining any Microsoft technology in under 60 seconds.",

        link: "https://www.linkedin.com/posts/mlsa-miet_msftstudentambassadors-microsoft-mlsa-activity-7358129436451352576-rZRp?utm_source=social_share_send&utm_medium=android_app&rcm=ACoAAEPnbUgBL7nBYpzb91o3DYvQ_Hqd0favIjE&utm_campaign=copy_link",

    },
      {

        id: "dsa",

        title: "DSA Level Up Session",

        date: "June 21, 2025",

        time: "07:00 PM - 9:00 PM",

        location: "Online",

        description: "Learn how to start your DSA journey in a way that feels approachable and achievable.",

        link: "#",

    },
   {

        id: "devgathering",

        title: "Dev Gathering 2k25",

        date: "May 16, 2025",

        time: "2 days",

        location: "MIET Schroff Block",

        description: "An overnight hackathon with 100+ participants and 30+ projects.",

        link: "https://www.devgathering2k25.xyz/",

    }, 
       {

        id: "Samaarambh",

        title: "Samaarambh 2.0",

        date: "December 28, 2024",

        time: "11:00 AM - 2:00 PM",

        location: "Microsoft Office , Gurugram",

        description: "Gave students an inspiring industrial exposure at Microsoft Gurugram through impactful sessions , activities and challenges. ",

        link: "#",

    },
     {
    id: "Avsar",
    title: "Avsar 2.0",
    date: "September 2, 2025",
    time: "1 day",
    location: "Auditorium 4",
    description: "Join us with Mr. Rohit Yadav as we dive into 'How to get into Microsoft' and unlock pathways to your dream career.",
    link: "https://www.linkedin.com/company/mlsa-miet/", 
    registrationType: 'link', 
  }
];

// .......... EVENT CARD COMPONENT ..........
const EventCard = ({ event, isUpcoming = false }: { event: Event; isUpcoming?: boolean; }) => {
   

    const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect><line x1="16" x2="16" y1="2" y2="6"></line><line x1="8" x2="8" y1="2" y2="6"></line><line x1="3" x2="21" y1="10" y2="10"></line></svg>;
    const ClockIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
    const MapPinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
    const ExternalLinkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" x2="21" y1="14" y2="3"></line></svg>;

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-slate-800/60 backdrop-blur-sm border border-slate-700 shadow-lg transition-all duration-300 hover:-translate-y-2 active:scale-[0.98] hover:shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ filter: 'blur(20px)' }}></div>
            <div className="relative z-10 flex flex-col h-full p-6">
                <div className="flex-grow">
                    <h3 className="text-xl font-bold text-white">{event.title}</h3>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400 text-sm">
                        <span className="inline-flex items-center gap-1.5"><CalendarIcon /> {event.date}</span>
                        <span className="inline-flex items-center gap-1.5"><ClockIcon /> {event.time}</span>
                        <span className="inline-flex items-center gap-1.5"><MapPinIcon /> {event.location}</span>
                    </div>
                </div>
                <div className="my-4 border-t border-slate-700 pt-4 flex-grow">
                    <p className="text-sm text-slate-300">{event.description}</p>
                </div>
                {/* 👇 THIS IS THE UPDATED LOGIC FOR THE FOOTER BUTTONS 👇 */}
                <div className="mt-auto">
                    {isUpcoming ? (
                        <>
                            {event.registrationType === 'signin' ? (
                                <SignInButton />
                            ) : (
                                <Link href={event.link} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                                    Register Now <ExternalLinkIcon />
                                </Link>
                            )}
                        </>
                    ) : (
                        <Link href={event.link} className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                             View Details <ExternalLinkIcon />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

// .......... MAIN EVENTS PAGE COMPONENT ..........
const EventsPage: NextPage = () => {
    // ... The rest of your EventsPage component remains exactly the same
    useEffect(() => {
        document.title = 'Events | MLSA MIET Chapter';
    }, []);

    const [activeTab, setActiveTab] = useState('upcoming');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
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
                    <div className={`py-20 sm:py-24 px-4 transition-opacity duration-700 ease-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="max-w-5xl mx-auto text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white relative inline-block pb-2">
                                Our Events
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                            </h1>
                            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-300">
                                Dive into what’s coming next and relive the highlights that made our past events unforgettable!
                            </p>
                        </div>

                        <div className="flex justify-center my-12">
                            <div className="flex space-x-2 rounded-lg bg-slate-800/80 p-1.5 border border-slate-700">
                                <button
                                    onClick={() => setActiveTab('upcoming')}
                                    className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'upcoming' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'}`}
                                >
                                    Upcoming
                                </button>
                                <button
                                    onClick={() => setActiveTab('past')}
                                    className={`px-4 sm:px-6 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'past' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-700'}`}
                                >
                                    Past
                                </button>
                            </div>
                        </div>

                        <div className="max-w-5xl mx-auto">
                            {activeTab === 'upcoming' && (
                                <>
                                    {upcoming.length > 0 ? (
                                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2">
                                            {upcoming.map((e) => (
                                                <EventCard key={e.id} event={e} isUpcoming />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 px-6 rounded-2xl bg-slate-800/50 border border-slate-700">
                                            <h3 className="text-2xl font-semibold text-white">No Upcoming Events</h3>
                                            <p className="mt-2 text-slate-400">Check back soon for new and exciting events!</p>
                                        </div>
                                    )}
                                </>
                            )}
                            {activeTab === 'past' && (
                                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {past.map((e) => (
                                        <EventCard key={e.id} event={e} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default EventsPage;