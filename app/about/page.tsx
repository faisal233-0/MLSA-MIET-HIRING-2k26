"use client";
import type { NextPage } from 'next';
import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image'; 

//SHARED COMPONENTS ..............
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CursorSpotlight from '../components/CursorSpotlight';
import PlexusBackground from '../components/PlexusBackground';

//ABOUT PAGE SPECIFIC COMPONENTS
const ImageSwitcher = () => {
    const images = [
        '/team/team2.jpg',
        '/team/team3.jpg',
        '/team/team4.jpg',
        '/team/team5.jpg',
    ];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);
    return (
        <div className="relative w-80 h-80 md:w-96 md:h-96 group">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            {images.map((src, index) => (
               <Image
                   key={src}
                   src={src}
                   alt={`Community image ${index + 1}`}
                   fill // This is the key change for absolutely positioned images
                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Helps optimize image loading
                   className={`absolute inset-0 object-cover rounded-full border-4 border-slate-800 transition-opacity duration-1000 ease-in-out ${
                   index === currentImageIndex ? 'opacity-100' : 'opacity-0'
    }`}
/>
            ))}
        </div>
    );
};

const JourneyImpactCard = () => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const { left, top, width, height } = card.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;
        const rotateX = -10 * ((y - height / 2) / (height / 2));
        const rotateY = 10 * ((x - width / 2) / (width / 2));
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 lg:p-12 transition-transform duration-300 ease-out"
        >
            <div className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                 style={{ background: 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.25), transparent 80%)' }}>
            </div>
            <div className="relative text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Journey & Impact</h2>
                <p className="text-lg text-slate-400 max-w-4xl mx-auto leading-relaxed">
                    With a history of impactful events, industrial visits, and tech-driven initiatives, MLSA MIET has consistently grown, attracting thousands of participants across various technical domains. Our events, including SAMAARAMBH, PRAYAS, and Generative AI sessions, have witnessed an overwhelming response, with footfalls exceeding 1000+ registrations per event.
                </p>
            </div>
        </div>
    );
};

//ABOUT PAGE 
const AboutPage: NextPage = () => {
  useEffect(() => {
    document.title = 'About Us | MLSA MIET Chapter';
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

        <main className="flex-grow flex flex-col items-center justify-center py-20 sm:py-24 px-4">
            <div className="max-w-7xl mx-auto w-full">
                <div className="text-center mb-20">
                    <h1 className="group text-5xl md:text-7xl font-black tracking-tighter text-white relative" style={{textShadow: '0 4px 20px rgba(59, 130, 246, 0.5)'}}>
                        <span className="relative inline-block">
                            Compile Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Journey</span>
                            <span className="absolute -bottom-2 left-0 w-0 h-1.5 bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500 group-hover:w-full"></span>
                        </span>
                    </h1>
                </div>

                <div className="grid md:grid-cols-5 gap-16 items-center mb-24">
                    <div className="md:col-span-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 lg:p-12">
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                            MLSA MIET is a vibrant community dedicated to fostering tech enthusiasm, innovation, and collaboration. Since its inception, the community has actively engaged students in cutting-edge technologies, hands-on workshops, and industry networking, creating a strong bridge between academia and the professional world.
                        </p>
                        <p className="mt-6 text-lg md:text-xl text-slate-300 leading-relaxed">
                            We believe in learning by doing. Our members get opportunities to work on real-world projects, participate in hackathons, and lead workshops, helping them grow as developers, leaders, and innovators.
                        </p>
                    </div>
                    <div className="md:col-span-2 flex justify-center items-center">
                        <ImageSwitcher />
                    </div>
                </div>

                <JourneyImpactCard />
            </div>
        </main>

        <Footer />

      </div>
    </div>
  );
};

export default AboutPage;
