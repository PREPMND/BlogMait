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

    // Spring settings
    const springConfig = { stiffness: 150, damping: 15, mass: 0.6 };
    const rotateXSpring = useSpring(rotateX, springConfig);
    const rotateYSpring = useSpring(rotateY, springConfig);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const rX = (mouseY / rect.height - 0.5) * -12;
        const rY = (mouseX / rect.width - 0.5) * 12;

        rotateX.set(rX);
        rotateY.set(rY);
    };

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
                    0%,
                    100% {
                        border-color: rgb(64 64 64);
                        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
                    }

                    50% {
                        border-color: rgb(82 82 82);
                        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
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
                className="glowing-card md:w-[40%] h-[40%] p-6 bg-neutral-900 text-neutral-100 cursor-pointer border border-neutral-700 rounded-2xl flex flex-col justify-between transition-colors duration-200"
            >
                <div
                    className="space-y-3 pointer-events-none"
                    style={{ transform: "translateZ(20px)" }}
                >
                    <span className="text-xs font-semibold text-neutral-500 tracking-wider">
                        ARTICLE #{id}
                    </span>

                    <h3 className="text-xl font-bold tracking-tight text-neutral-100 leading-snug">
                        {title}
                    </h3>

                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-6">
                        {description}
                    </p>
                </div>

                <div
                    className="pt-4 border-t border-neutral-700 flex items-center justify-between text-xs text-neutral-500 pointer-events-none"
                    style={{ transform: "translateZ(10px)" }}
                >
                    <span>Double-click to open</span>
                    <span className="text-neutral-400">✦</span>
                </div>
            </motion.div>
        </div>
    );
}