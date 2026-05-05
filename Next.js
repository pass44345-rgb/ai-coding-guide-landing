"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// --- 1. DASHBOARD COMPONENT (Framer Motion) ---
const BentoCard = ({ title, progress }: { title: string; progress: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative p-6 bg-slate-900 rounded-2xl overflow-hidden cursor-pointer group col-span-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div 
        className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" 
      />
      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <h3 className="text-white font-medium text-lg">{title}</h3>
        <div className="relative w-12 h-12 self-end">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r="20" fill="transparent" stroke="#334155" strokeWidth="4" />
            <motion.circle
              cx="24" cy="24" r="20"
              fill="transparent"
              stroke="#6366F1"
              strokeWidth="4"
              strokeDasharray={125.6} // 2 * PI * r (approx 125.6 for r=20)
              initial={{ strokeDashoffset: 125.6 }}
              animate={{ strokeDashoffset: isHovered ? 125.6 - (125.6 * progress) / 100 : 125.6 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  );
};

// --- 2. FOCUS TRANSITION COMPONENT (Framer Motion) ---
const FocusTransition = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative flex items-center justify-center my-12 h-[100px]">
      <AnimatePresence>
        {!isExpanded ? (
          <motion.button
            layoutId="learning-canvas"
            onClick={() => setIsExpanded(true)}
            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-semibold shadow-[0_0_20px_rgba(79,70,229,0.4)] relative z-20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Learning
          </motion.button>
        ) : (
          <motion.div
            layoutId="learning-canvas"
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col"
          >
            <div className="p-6 flex justify-between items-center border-b border-slate-800">
              <h2 className="text-white text-xl font-serif">Module 1: The Core</h2>
              <button 
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-white px-4 py-2 bg-slate-800 rounded-md"
              >
                Close (ESC)
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 space-y-4">
              <div className="w-32 h-32 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-lg">Immersive Learning Environment Active...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 3. MAIN PAGE COMPONENT (GSAP ScrollTrigger + Layout) ---
export default function EdTechLandingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // SVG Line Drawing on Scroll
      const path = pathRef.current;
      if (path) {
        const pathLength = path.getTotalLength() || 0;
        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5,
          }
        });
      }

      // Marker Text Highlighting
      if (textRef.current) {
        gsap.to(textRef.current, {
          backgroundSize: "100% 100%",
          ease: "none",
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            end: "top 50%",
            scrub: true,
          }
        });
      }

      // Floating Parallax Elements
      gsap.utils.toArray('.floating-icon').forEach((icon: any) => {
        const speed = icon.getAttribute('data-speed') || 1;
        gsap.to(icon, {
          y: () => -150 * speed,
          rotation: () => 45 * speed,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });
    }, containerRef);

    return () => ctx.revert(); // Cleanup
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[250vh] bg-slate-50 overflow-hidden font-sans">
      
      {/* Background Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="floating-icon absolute top-[20%] left-[10%] w-16 h-16 bg-indigo-200/50 rounded-lg rotate-12 backdrop-blur-sm" data-speed="1.5"></div>
        <div className="floating-icon absolute top-[40%] right-[15%] w-24 h-24 bg-rose-200/50 rounded-full backdrop-blur-sm" data-speed="0.8"></div>
        <div className="floating-icon absolute top-[70%] left-[20%] w-20 h-20 bg-emerald-200/50 rounded-xl -rotate-12 backdrop-blur-sm" data-speed="2"></div>
      </div>

      {/* The Knowledge Path (SVG Line) */}
      <div className="absolute left-1/2 top-0 h-full w-2 -translate-x-1/2 z-0 hidden md:block">
        <svg className="h-full w-full">
          <path ref={pathRef} d="M 1 0 V 4000" stroke="#4F46E5" strokeWidth="3" strokeDasharray="10 10" fill="none" />
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-32 flex flex-col items-center">
        
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-[30vh] bg-white/80 p-10 rounded-3xl shadow-xl backdrop-blur-md">
          <h1 className="text-5xl md:text-7xl font-serif text-slate-900 font-bold tracking-tight">
            Education, <br className="md:hidden" /> Evolved.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Experience an interactive curriculum designed to adapt to your pace.
          </p>
          <FocusTransition />
        </div>

        {/* Highlight Section */}
        <div className="my-[20vh] bg-white p-10 rounded-2xl shadow-lg border border-slate-100 max-w-3xl text-center">
          <h2 className="text-4xl font-serif text-slate-800 leading-relaxed">
            Master the fundamentals with an unprecedented <br/>
            <span 
              ref={textRef}
              className="bg-gradient-to-r from-yellow-300 to-yellow-300 bg-no-repeat transition-all px-2 font-bold"
              style={{ backgroundSize: '0% 100%', backgroundPosition: 'left center' }}
            >
              98% success rate.
            </span>
          </h2>
        </div>

        {/* Interactive Dashboard Grid */}
        <div className="w-full mt-[20vh]">
          <div className="mb-12 text-center md:text-left bg-white/90 p-6 rounded-2xl inline-block shadow-sm">
            <h2 className="text-3xl font-serif text-slate-900 font-bold">Your Knowledge Nodes</h2>
            <p className="text-slate-500 mt-2">Hover to view your mastery progress.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <BentoCard title="Data Structures" progress={85} />
            <BentoCard title="Advanced Algorithms" progress={40} />
            <BentoCard title="System Design" progress={15} />
            <div className="md:col-span-2">
              <BentoCard title="Full-Stack Integration" progress={60} />
            </div>
            <BentoCard title="Cloud Deployment" progress={10} />
          </div>
        </div>
        
      </main>
    </div>
  );
}
