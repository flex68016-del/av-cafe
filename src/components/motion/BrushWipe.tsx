'use client';

import { motion } from 'framer-motion';

interface BrushWipeProps {
  className?: string;
}

export function BrushWipe({ className = '' }: BrushWipeProps) {
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      whileInView={{ width: '100%' }}
      viewport={{ once: true }}
      transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`h-1 bg-orange-500 ${className}`}
    />
  );
}
