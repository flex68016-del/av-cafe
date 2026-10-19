'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function Button({ children, variant = 'primary', className = '', onClick, href }: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium min-h-[44px] text-center';
  
  const variants = {
    primary: 'bg-orange-500 text-white hover:bg-orange-600',
    secondary: 'border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white',
  };

  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animationProps = shouldReduceMotion ? {} : {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 },
  };

  if (href) {
    return (
      <Link href={href} className={`${baseStyles} ${variants[variant]} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...animationProps}
    >
      {children}
    </motion.button>
  );
}
