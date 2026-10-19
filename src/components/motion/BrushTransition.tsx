'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BrushTransitionProps {
  className?: string;
}

export function BrushTransition({ className = '' }: BrushTransitionProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useGSAP(() => {
    if (shouldReduceMotion || !pathRef.current) return;

    const path = pathRef.current;
    const length = path.getTotalLength();

    const ctx = gsap.context(() => {
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.5,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: path,
          start: 'top 80%',
          end: 'top 30%',
          toggleActions: 'play none none reverse',
        },
      });
    }, pathRef);

    return () => ctx.revert();
  }, [shouldReduceMotion]);

  if (shouldReduceMotion) {
    return <div className={`h-1 bg-orange-500 ${className}`} />;
  }

  return (
    <svg className={`w-full h-2 ${className}`} viewBox="0 0 100 2" preserveAspectRatio="none">
      <path
        ref={pathRef}
        d="M0,1 L100,1"
        stroke="#F57C1F"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
