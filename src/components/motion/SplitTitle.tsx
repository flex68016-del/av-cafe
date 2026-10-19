'use client';

import { motion } from 'framer-motion';

interface SplitTitleProps {
  text: string;
  className?: string;
  delay?: number;
}

export function SplitTitle({ text, className = '', delay = 0 }: SplitTitleProps) {
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (shouldReduceMotion) {
    return <h2 className={className}>{text}</h2>;
  }

  const words = text.split(' ');

  return (
    <h2 className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: delay + index * 0.05 }}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </h2>
  );
}
