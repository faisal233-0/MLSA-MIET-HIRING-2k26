"use client";
import React, { useState, useEffect } from 'react';
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

    if (!isMounted) {
        return null;
    }

    return (
        <div 
            className="pointer-events-none fixed inset-0 z-50 transition duration-300"
            style={{
                background: 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(59, 130, 246, 0.2), transparent 80%)'
            }}
        ></div>
    );
};
export default CursorSpotlight;