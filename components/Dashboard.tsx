'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const cards = [
  {
    title: 'Tasks',
    subtitle: 'Mission Control',
    path: '/tasks',
    gradient: 'from-purple-800 via-indigo-900 to-black',
    glow: 'shadow-[0_0_30px_5px_rgba(125,211,252,0.1)]',
    ring: 'ring-blue-300',
    icon: '🚀',
    status: 'OPERATIONAL',
    coordinates: 'X: 42.3 Y: 15.7',
    power: '98%',
    temperature: '23°C',
  },
  {
    title: 'Calendar',
    subtitle: 'Solar Hub',
    path: '/calendar',
    gradient: 'from-yellow-300 via-orange-400 to-red-500',
    glow: 'shadow-[0_0_30px_5px_rgba(255,215,0,0.2)]',
    ring: 'ring-yellow-400',
    icon: '☀️',
    status: 'ACTIVE',
    coordinates: 'X: 38.9 Y: 12.4',
    power: '100%',
    temperature: '28°C',
  },
  {
    title: 'Notes',
    subtitle: 'Preservation Station',
    path: '/notes',
    gradient: 'from-green-800 via-emerald-600 to-slate-900',
    glow: 'shadow-[0_0_30px_5px_rgba(50,205,50,0.2)]',
    ring: 'ring-green-400',
    icon: '🌍',
    status: 'STANDBY',
    coordinates: 'X: 45.2 Y: 18.6',
    power: '95%',
    temperature: '21°C',
  },
];

export default function Dashboard() {
  const [stars, setStars] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    // Generate star positions only on the client side
    const starPositions = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setStars(starPositions);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-950 to-neutral-900 py-12 px-6 relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: star.x,
              y: star.y,
              opacity: 0 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Scanning Line Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent animate-scan"></div>

      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Nebula Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 animate-pulse-slow"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center relative z-10">
        <div className="relative">
          {/* Decorative lines */}
          <div className="absolute left-0 top-1/2 -translate-x-8 w-16 h-[2px] bg-gradient-to-r from-transparent via-blue-400 to-transparent"></div>
          <div className="absolute right-0 top-1/2 translate-x-8 w-16 h-[2px] bg-gradient-to-l from-transparent via-blue-400 to-transparent"></div>
          
          {/* Title container */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
            
            {/* Main title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative text-4xl md:text-6xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-sky-400 tracking-wider font-mono"
            >
              Welcome to Your Command Center
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center text-sm md:text-base text-blue-300/70 mt-2 font-mono tracking-wider"
            >
              INITIALIZING SYSTEMS...
            </motion.p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12 place-items-center">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center"
            >
              <Link href={card.path}>
                <div className="relative w-60 h-60 group">
                  {/* Outer Orbital Ring */}
                  <div className="absolute inset-0 animate-spin-slow rounded-full border border-white/10"></div>
                  
                  {/* Inner Orbital Ring (counter-rotating) */}
                  <div className="absolute inset-2 animate-spin-slow-reverse rounded-full border border-white/5"></div>
                  
                  {/* Particle Effects */}
                  <div className="absolute inset-0">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full"
                        initial={{ 
                          x: '50%',
                          y: '50%',
                          opacity: 0 
                        }}
                        animate={{ 
                          x: `${Math.cos(i * Math.PI / 4) * 100}%`,
                          y: `${Math.sin(i * Math.PI / 4) * 100}%`,
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Main Card */}
                  <div className={`relative w-full h-full rounded-full bg-gradient-to-br ${card.gradient} text-white flex flex-col items-center justify-center ${card.glow} hover:ring-2 ${card.ring} hover:scale-105 transition duration-300`}>
                    {/* Status Indicator */}
                    <div className="absolute top-4 right-4 flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${card.status === 'ACTIVE' ? 'bg-green-400' : card.status === 'OPERATIONAL' ? 'bg-blue-400' : 'bg-yellow-400'} animate-pulse`}></div>
                      <span className="text-xs font-mono tracking-wider">{card.status}</span>
                    </div>

                    {/* Main Content */}
                    <div className="text-center">
                      <span className="text-4xl mb-2 block">{card.icon}</span>
                      <h2 className="text-xl font-semibold">{card.title}</h2>
                      <p className="text-sm opacity-70">{card.subtitle}</p>
                    </div>

                    {/* Coordinates */}
                    <div className="absolute bottom-4 left-4 text-xs font-mono tracking-wider opacity-50">
                      {card.coordinates}
                    </div>

                    {/* Power Level */}
                    <div className="absolute bottom-4 right-4 text-xs font-mono tracking-wider">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-green-400"></div>
                        <span>POWER: {card.power}</span>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="absolute top-4 left-4 text-xs font-mono tracking-wider">
                      <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-red-400"></div>
                        <span>{card.temperature}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 