"use client";
import React, { useRef, useEffect } from 'react';

const PlexusBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
           
            canvas.height = Math.max(document.body.scrollHeight, window.innerHeight);
        };

        let points: { x: number; y: number; vx: number; vy: number; }[] = [];
        const calculatePointCount = () => Math.floor((window.innerWidth * window.innerHeight) / 9000);

        const initPoints = () => {
            const pointCount = calculatePointCount();
            points = [];
            for (let i = 0; i < pointCount; i++) {
                points.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: Math.random() * 0.3 - 0.15,
                    vy: Math.random() * 0.3 - 0.15,
                });
            }
        };

        const draw = () => {
            if (!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            points.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(147, 197, 253, 0.6)';
                ctx.fill();
            });

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const dist = Math.sqrt(Math.pow(points[i].x - points[j].x, 2) + Math.pow(points[i].y - points[j].y, 2));
                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(points[i].x, points[i].y);
                        ctx.lineTo(points[j].x, points[j].y);
                        ctx.strokeStyle = `rgba(147, 197, 253, ${1 - dist / 150})`;
                        ctx.lineWidth = 0.7;
                        ctx.stroke();
                    }
                }
            }
            animationFrameId = requestAnimationFrame(draw);
        };

        const handleResize = () => {
            resizeCanvas();
            initPoints();
        };

        window.addEventListener('resize', handleResize);
         setTimeout(() => {
            resizeCanvas();
            initPoints();
            draw();
        }, 100);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />;
};

export default PlexusBackground;