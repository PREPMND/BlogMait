"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "motion/react";

interface BlogCardProps {
  id: string | number;
  title: string;
  description: string;
  slug: string;
}

export default function SmoothBlogCard({ id, title, description, slug }: BlogCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize Spring Physics values for buttery smooth 3D rotations
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  // High damping & mass settings to make the tilt feel heavy, premium, and slow to slide
  const springConfig = { stiffness: 180, damping: 26, mass: 0.8 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);
  const scaleSpring = useSpring(scale, springConfig);

  // Calculates the exact corner/edge coordinate clicked to depress it
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Position of cursor relative to card top-left corner
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalise coordinates (-0.5 to 0.5) relative to card center
    // Max tilt set to ~7 degrees for a premium, understated depth feel
    const rX = (mouseY / height - 0.5) * -7; 
    const rY = (mouseX / width - 0.5) * 7;   

    rotateX.set(rX);
    rotateY.set(rY);
    scale.set(0.99); // Imperceptible dip inward to enhance the push illusion
  };

  // Smoothly returns back to perfect dead-flat alignment on release
  const handlePointerUp = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  const handleDoubleClick = () => {
    router.push(`/blog/${slug}`);
  };

  return (
    <div 
      // 1. Perspective wrapper gives the browser genuine 3D tracking depth
      className="[perspective:1200px] select-none"
    >
      <style jsx>{`
        @keyframes ambientGlow {
          0%, 100% { border-color: rgba(226, 232, 240, 0.8); box-shadow: 0 0 15px rgba(56, 189, 248, 0.05); }
          50% { border-color: rgba(186, 230, 253, 1); box-shadow: 0 0 25px rgba(56, 189, 248, 0.15); }
        }
        .glowing-card {
          animation: ambientGlow 4s ease-in-out infinite;
        }
      `}</style>

      <motion.div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} 
        onDoubleClick={handleDoubleClick}
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          scale: scaleSpring,
          transformStyle: "preserve-3d",
        }}
        // 2. Transformed to match your specific 12cm x 7.5cm proportion layout
        className="glowing-card w-[284px] h-[453px] p-6 bg-white text-slate-800 cursor-pointer 
                   border border-slate-200 rounded-2xl flex flex-col justify-between
                   transition-colors duration-300"
      >
        <div className="space-y-3 pointer-events-none" style={{ transform: "translateZ(5px)" }}>
          <span className="text-xs font-semibold text-slate-400 tracking-wider">ARTICLE #{id}</span>
          <h3 className="text-xl font-bold tracking-tight text-slate-900 leading-snug">{title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-6">{description}</p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 pointer-events-none">
          <span>Double-click to open</span>
          <span className="text-sky-400/70">✦</span>
        </div>
      </motion.div>
    </div>
  );
}
