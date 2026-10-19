'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface BounceBadgeProps {
  count: number;
  className?: string;
}

export function BounceBadge({ count, className = '' }: BounceBadgeProps) {
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (count === 0) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={count}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        exit={{ scale: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
        className={`absolute -top-2 -right-2 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center ${className}`}
      >
        {count}
      </motion.div>
    </AnimatePresence>
  );
}
