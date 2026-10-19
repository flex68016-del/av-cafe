'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

interface CheckAnimationProps {
  onComplete?: () => void;
  size?: number;
}

export function CheckAnimation({ onComplete, size = 64 }: CheckAnimationProps) {
  const controls = useAnimation();
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (shouldReduceMotion) {
      onComplete?.();
      return;
    }

    controls.start({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: 'easeInOut' },
        opacity: { duration: 0.2 },
      },
    }).then(() => {
      onComplete?.();
    });
  }, [controls, onComplete, shouldReduceMotion]);

  if (shouldReduceMotion) {
    return (
      <div className="text-orange-500" style={{ width: size, height: size }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
          <path d="M5 13l4 4L19 7" />
        </svg>
      </div>
    );
  }

  return (
    <div className="text-orange-500" style={{ width: size, height: size }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <motion.path
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={controls}
        />
      </svg>
    </div>
  );
}
