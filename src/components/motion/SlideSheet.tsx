'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface SlideSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: 'bottom' | 'right';
}

export function SlideSheet({ isOpen, onClose, children, position = 'bottom' }: SlideSheetProps) {
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const variants = {
    bottom: {
      open: { y: 0 },
      closed: { y: '100%' },
    },
    right: {
      open: { x: 0 },
      closed: { x: '100%' },
    },
  };

  const className = position === 'bottom' ? 'fixed inset-x-0 bottom-0' : 'fixed inset-y-0 right-0';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          <motion.div
            initial={variants[position].closed}
            animate={variants[position].open}
            exit={variants[position].closed}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeInOut' }}
            className={`${className} bg-[#0B0B0B] border-t border-gray-800 z-50 max-h-[80vh] overflow-auto ${position === 'right' ? 'w-full max-w-md' : 'rounded-t-2xl'}`}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
