"use client";

import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "motion/react"; // Modern independent path

interface BlogCardProps {
  id: string | number;
  title: string;
  description: string;
  slug: string;
}

export default function BlogCard({ id, title, description, slug }: BlogCardProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize Spring Physics values for buttery smooth 3D rotations
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  // Configure spring stiffness and damping (higher stiffness = snappier bounce)
  const springConfig = { stiffness: 250, damping: 20, mass: 0.5 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);
  const scaleSpring = useSpring(scale, springConfig);

  // Calculate the exact corner clicked to tilt back smoothly
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Get cursor position relative to the card's top-left corner
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates (-0.5 to 0.5 range) relative to card center
    const rX = (mouseY / height - 0.5) * -12; // Controls vertical tilt limit (degrees)
    const rY = (mouseX / width - 0.5) * 12;   // Controls horizontal tilt limit (degrees)

    rotateX.set(rX);
    rotateY.set(rY);
    scale.set(0.96); // Slight face push back on press
  };

  // Instant snap back to perfect flat-face state on release
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
      className="w-full max-w-sm [perspective:1000px] select-none" // 3D viewport setup
    >
      <motion.div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp} // Resets if mouse drags away
        onDoubleClick={handleDoubleClick}
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          scale: scaleSpring,
          transformStyle: "preserve-3d", // Keeps child text layout crisp in 3D space
        }}
        className="w-full p-5 bg-white text-slate-800 cursor-pointer border-2 border-slate-900 rounded-2xl
                   shadow-[4px_4px_0px_0px_rgba(56,189,248,1)] transition-shadow duration-200
                   hover:shadow-[8px_8px_0px_0px_rgba(56,189,248,1)]"
      >
        <div 
          className="space-y-2 pointer-events-none" // Keeps child divs from blocking cursor math
          style={{ transform: "translateZ(10px)" }} // Tiny internal layer pop depth
        >
          <span className="text-xs font-bold text-sky-500 uppercase tracking-wider">Blog #{id}</span>
          <h3 className="text-xl font-extrabold tracking-tight leading-tight">{title}</h3>
          <p className="text-sm text-slate-500 line-clamp-2">{description}</p>
          <div className="pt-2 text-xs font-semibold text-indigo-500 flex items-center gap-1">
            <span>⚡ Double click to open</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
