"use client";
import type { NextPage } from 'next';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import SignInButton from './components/SignInButton';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CursorSpotlight from './components/CursorSpotlight';
import PlexusBackground from './components/PlexusBackground';
import MLSALogo from './components/MLSALogo';

// ....LANDING PAGE SPECIFIC COMPONENTS ....
const VisionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);
const GoalIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);
const MissionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const words = ["Student", "Creators", "Coders", "Shapers"];
const TypingEffect = () => {
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const [typingSpeed, setTypingSpeed] = useState(150);

    useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % words.length;
            const fullText = words[i];
            setText(isDeleting ? fullText.substring(0, text.length - 1) : fullText.substring(0, text.length + 1));
            setTypingSpeed(isDeleting ? 80 : 150);
            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 1000);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };
        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, typingSpeed]);
    return <span className="text-blue-400 border-r-2 border-blue-400 animate-pulse">{text}</span>;
};

// .......... COUNTDOWN COMPONENT ............
const RegistrationCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isCounting, setIsCounting] = useState(false);
    const [hasEnded, setHasEnded] = useState(false);

    useEffect(() => {
        const startDate = new Date('2025-09-03T00:00:00');
        const endDate = new Date('2025-09-21T23:59:59');

        const interval = setInterval(() => {
            const now = new Date();

            if (now < startDate) {
                setIsCounting(false);
                setHasEnded(false);
            } else if (now > endDate) {
                setIsCounting(false);
                setHasEnded(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(interval);
            } else {
                setIsCounting(true);
                setHasEnded(false);
                const totalSeconds = (endDate.getTime() - now.getTime()) / 1000;

                setTimeLeft({
                    days: Math.floor(totalSeconds / 3600 / 24),
                    hours: Math.floor((totalSeconds / 3600) % 24),
                    minutes: Math.floor((totalSeconds / 60) % 60),
                    seconds: Math.floor(totalSeconds % 60),
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const TimeUnit = ({ value, label }: { value: number, label: string }) => (
        <div className="flex flex-col items-center">
            <span className="text-4xl sm:text-6xl font-bold text-blue-400 tracking-wider">
                {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">
                {label}
            </span>
        </div>
    );


    if (!isCounting && !hasEnded) {
        return (
            <div className="text-center bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-2">Volunteer Hiring Is Coming!</h3>
                <p className="text-slate-300 text-lg">Get ready to join us. Hiring opens on September 3rd, 2025.</p>
            </div>
        );
    }


    if (hasEnded) {
        return (
            <div className="text-center bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-700 max-w-4xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-2">Volunteer Hiring Has Closed</h3>
                <p className="text-slate-300 text-lg">Thank you for your interest. Stay tuned for future events!</p>
            </div>
        );
    }

    return (
        <div className="text-center bg-slate-800/60 backdrop-blur-sm p-8 sm:p-12 rounded-2xl border border-slate-700 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-white mb-8">Volunteer Hiring Closes In</h3>
            <div className="flex justify-center gap-2 sm:gap-8">
                <TimeUnit value={timeLeft.days} label="Days" />
                <span className="text-3xl sm:text-6xl font-bold text-slate-600">:</span>
                <TimeUnit value={timeLeft.hours} label="Hours" />
                <span className="text-3xl sm:text-6xl font-bold text-slate-600">:</span>
                <TimeUnit value={timeLeft.minutes} label="Minutes" />
                <span className="text-3xl sm:text-6xl font-bold text-slate-600">:</span>
                <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>
        </div>
    );
};

// .......... HIRING TIMELINE COMPONENT  ............
const HiringTimeline = () => {
    const timelineEvents = [
        { date: 'Sep 03, 2025', title: 'Applications Open', description: 'The hiring portal goes live. Submit your applications to join the team.' },
        { date: 'Sep 21, 2025', title: 'Applications Close', description: 'Last day to submit your application. Don\'t miss out!' },
        { date: 'Sep 25-30, 2025', title: 'Interview Rounds', description: 'Shortlisted candidates will be contacted for interviews.' },
        { date: 'Oct 05, 2025', title: 'Results Announced', description: 'Welcome to the new members of the MLSA MIET Chapter!' },
    ];

    return (
        <section id="timeline" className="py-20 sm:py-32 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl sm:text-5xl font-bold text-white relative inline-block pb-2">
                        Hiring Timeline
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                    </h2>
                </div>
                <div className="relative max-w-2xl mx-auto">
                    {/* The vertical line - always on the left for mobile-first design */}
                    <div className="absolute left-3 top-1 h-full w-0.5 bg-slate-700"></div>
                    
                    {timelineEvents.map((event, index) => (
                        <div key={index} className="relative pl-12 pb-12">
                             {/* The circle on the line */}
                            <div className="absolute left-3 top-1 -translate-x-1/2 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-slate-900 z-10"></div>
                            
                            {/* Content to the right of the line */}
                            <div>
                                <p className="text-blue-300 font-semibold mb-2">{event.date}</p>
                                <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 shadow-lg">
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    <p className="text-slate-400">{event.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// .......... LANDING PAGE ............
const LandingPage: NextPage = () => {
    useEffect(() => {
        document.title = 'MLSA MIET Chapter';
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
                <main id="home" className="flex-grow flex flex-col pt-2 items-center text-center px-4 ">
                    <div className="mb-4">
                         <MLSALogo width={200} height={200} className="w-40 h-40 sm:w-60 sm:h-60" />
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">
                        <span>Microsoft Learn</span>
                        <span className="block"><TypingEffect /> Ambassadors</span>
                    </h1>
                    <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-300">
                        MIET Chapter
                    </h2>
                    <p className="mt-8 max-w-2xl text-lg text-slate-400">
                        A passionate community of student leaders dedicated to helping peers and building solutions for a better tomorrow.
                    </p>
                    <div className="mt-12">
                        <SignInButton isHero={true} />
                    </div>
                </main>

                <section id="registration" className="py-20 sm:py-32 px-4">
                    <RegistrationCountdown />
                </section>

                <HiringTimeline />

                <section id="about" className="py-20 sm:py-32 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl sm:text-5xl font-bold text-white relative inline-block pb-2">
                                About Us
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></span>
                            </h2>
                        </div>
                        <div className="flex flex-wrap md:flex-nowrap justify-center items-center gap-8 md:gap-4 perspective-1000">
                            <div className="w-full md:w-1/3 group relative bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl text-center flex flex-col items-center transition-all duration-500 ease-out active:!scale-110 active:!rotate-0 active:!-translate-y-4 active:!z-20 md:hover:!scale-110 md:hover:!rotate-0 md:hover:!-translate-y-4 md:hover:!z-20 md:transform-gpu md:rotate-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ filter: 'blur(20px)' }}></div>
                                <div className="relative z-10 flex flex-col items-center h-full">
                                    <div className="bg-slate-900 p-4 rounded-full mb-6 ring-2 ring-slate-700 group-hover:ring-blue-400 transition-all duration-300">
                                        <VisionIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Vision</h3>
                                    <p className="text-slate-400 flex-grow">
                                        MLSA envisions a world where everyone has access to the benefits of technology. We believe that technology has the potential to be an effective tool for education.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 group relative bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl text-center flex flex-col items-center transition-all duration-500 ease-out active:!scale-110 active:!-translate-y-4 md:hover:!scale-110 md:hover:!-translate-y-4 z-10">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ filter: 'blur(20px)' }}></div>
                                <div className="relative z-10 flex flex-col items-center h-full">
                                    <div className="bg-slate-900 p-4 rounded-full mb-6 ring-2 ring-slate-700 group-hover:ring-blue-400 transition-all duration-300">
                                        <GoalIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Goal</h3>
                                    <p className="text-slate-400 flex-grow">
                                        Connecting people with technology and assisting them in using it to enhance their lives are the two main objectives of MLSA. We organize events and work on projects to achieve this.
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-1/3 group relative bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl text-center flex flex-col items-center transition-all duration-500 ease-out active:!scale-110 active:!rotate-0 active:!-translate-y-4 active:!z-20 md:hover:!scale-110 md:hover:!rotate-0 md:hover:!-translate-y-4 md:hover:!z-20 md:transform-gpu md:-rotate-6">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ filter: 'blur(20px)' }}></div>
                                <div className="relative z-10 flex flex-col items-center h-full">
                                    <div className="bg-slate-900 p-4 rounded-full mb-6 ring-2 ring-slate-700 group-hover:ring-blue-400 transition-all duration-300">
                                        <MissionIcon />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Mission</h3>
                                    <p className="text-slate-400 flex-grow">
                                        The mission of MLSA is &quot;Tech for All.&quot; We empower individuals to embrace the digital world with confidence through engaging events, innovative projects, and meaningful connections.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="text-center mt-24">
                            <Link href="/about" className="inline-block text-blue-300 font-semibold border-2 border-blue-400 rounded-lg px-8 py-3 hover:bg-blue-400 hover:text-white hover:shadow-lg hover:shadow-blue-400/30 transition-all duration-300">
                                Know More &rarr;
                            </Link>
                        </div>
                    </div>
                </section>
                <Footer />
            </div>
        </div>
    );
};

export default LandingPage;