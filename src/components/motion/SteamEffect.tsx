'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function SteamEffect() {
  const [particles] = useState<Array<{id: number; size: number; left: number; delay: number}>>(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return [];
    }
    return [...Array(5)].map((_, i) => ({
      id: i,
      size: 20 + Math.random() * 30,
      left: 30 + Math.random() * 40,
      delay: i * 0.5,
    }));
  });

  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/10 rounded-full blur-sm"
          initial={{
            x: '50%',
            y: '100%',
            scale: 0,
            opacity: 0,
          }}
          animate={{
            y: '-20%',
            scale: [0, 1, 0.5],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
          }}
        />
      ))}
    </div>
  );
}
