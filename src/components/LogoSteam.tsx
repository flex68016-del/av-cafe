/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';

interface LogoSteamProps {
  className?: string;
}

export default function LogoSteam({ className = '' }: LogoSteamProps) {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || prefersReducedMotion) {
    return null;
  }

  return (
    <svg
      className={`absolute inset-0 pointer-events-none ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes steam-rise {
            0% {
              opacity: 0;
              transform: translateY(0) scale(0.8);
            }
            50% {
              opacity: 0.6;
              transform: translateY(-10px) scale(1);
            }
            100% {
              opacity: 0;
              transform: translateY(-20px) scale(1.2);
            }
          }
          .steam-path-1 {
            animation: steam-rise 3s ease-in-out infinite;
            animation-delay: 0s;
          }
          .steam-path-2 {
            animation: steam-rise 3s ease-in-out infinite;
            animation-delay: 0.5s;
          }
          .steam-path-3 {
            animation: steam-rise 3s ease-in-out infinite;
            animation-delay: 1s;
          }
        `
      }} />
      {/* Vapeur principale */}
      <path
        className="steam-path-1"
        d="M35 80 Q30 70 35 60 Q40 50 35 40"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        className="steam-path-2"
        d="M50 80 Q45 70 50 60 Q55 50 50 40"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        className="steam-path-3"
        d="M65 80 Q60 70 65 60 Q70 50 65 40"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}
