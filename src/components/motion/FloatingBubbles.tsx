'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export function FloatingBubbles() {
  const [bubbles] = useState<Array<{id: number; size: number; x: number; y: number; duration: number; delay: number; xEnd: number}>>(() => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return [];
    }
    return [...Array(8)].map((_, i) => ({
      id: i,
      size: 10 + Math.random() * 20,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 3 + Math.random() * 2,
      delay: Math.random() * 2,
      xEnd: Math.random() * 20 - 10,
    }));
  });

  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute bg-orange-500/20 rounded-full"
          initial={{
            x: `${bubble.x}%`,
            y: `${bubble.y}%`,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            y: [`${bubble.y}%`, `${bubble.y - 30}%`],
            x: [`${bubble.x}%`, `${bubble.x + bubble.xEnd}%`],
            scale: [0, 1, 0.8],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: 'easeInOut',
          }}
          style={{
            width: bubble.size,
            height: bubble.size,
          }}
        />
      ))}
    </div>
  );
}
