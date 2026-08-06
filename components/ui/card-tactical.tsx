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

export default function Perfect3DTiltCard({ id, title, description, slug }: BlogCardProps) {
    const router = useRouter();
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Rotation tracking values
    const rotateX = useMotionValue(0);
    const rotateY = useMotionValue(0);

    // Spring settings - lower damping makes it react instantly and feel fluid
    const springConfig = { stiffness: 150, damping: 15, mass: 0.6 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    // 1. DYNAMIC HOVER TRACKING: Runs the exact millisecond the cursor moves over the card
    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Pinpoint where the cursor is touching inside the 12cm container
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Calculate rotation angle based on cursor position (-10 to 10 degree limits)
        const rX = (mouseY / height - 0.5) * -12;
        const rY = (mouseX / width - 0.5) * 12;

        rotateX.set(rX);
        rotateY.set(rY);
    };

    // 2. RESET STATE: Instantly flattens back out when the hand leaves the card
    const handlePointerLeave = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    const handleDoubleClick = () => {
        router.push(`/blog/${slug}`);
    };

    return (
        <div className="[perspective:1000px] select-none">
            <style jsx>{`
        @keyframes ambientGlow {
  0%, 100% {
    border-color: rgb(64 64 64);
    box-shadow: 0 12px 30px rgba(0,0,0,.35);
  }

  50% {
    border-color: rgb(82 82 82);
    box-shadow: 0 12px 30px rgba(0,0,0,.35);
  }
}

        .glowing-card {
  animation: ambientGlow 4s ease-in-out infinite;
       will-change: transform;
       }
      `}</style>

            <motion.div
                ref={cardRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
                onDoubleClick={handleDoubleClick}
                style={{
                    rotateX: rotateXSpring,
                    rotateY: rotateYSpring,
                    transformStyle: "preserve-3d",
                }}
                className="glowing-card w-[284px] h-[453px] p-6 bg-white text-slate-800 cursor-pointer 
                   border border-slate-200 rounded-2xl flex flex-col justify-between
                   transition-colors duration-200"
            >
                {/* translateZ forces the text elements to pop out slightly in real 3D depth */}
                <div className="space-y-3 pointer-events-none" style={{ transform: "translateZ(20px)" }}>
                    <span className="text-xs font-semibold text-slate-400 tracking-wider">ARTICLE #{id}</span>
                    <h3 className="text-xl font-bold tracking-tight text-slate-900 leading-snug">{title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-6">{description}</p>
                </div>

                <div
                    className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 pointer-events-none"
                    style={{ transform: "translateZ(10px)" }}
                >
                    <span>Double-click to open</span>
                    <span className="text-sky-400/70">✦</span>
                </div>
            </motion.div>
        </div>
    );
}
