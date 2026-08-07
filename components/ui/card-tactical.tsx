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

        const rX = (mouseY / rect.height - 0.5) * -16;
        const rY = (mouseX / rect.width - 0.5) * 16;

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
    0%,100%{
        border-color:rgba(255,255,255,.08);
        box-shadow:
            0 20px 45px rgba(0,0,0,.45),
            inset 0 1px 0 rgba(255,255,255,.06);
    }

    50%{
        border-color:rgba(255,255,255,.14);
        box-shadow:
            0 26px 60px rgba(0,0,0,.55),
            inset 0 1px 0 rgba(255,255,255,.08);
    }
}

.glowing-card{
    animation:ambientGlow 5s ease-in-out infinite;
    will-change:transform;
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
                    backgroundImage: `
                    radial-gradient(circle at top left, rgba(255,255,255,0.08), transparent 35%),linear-gradient(145deg, rgb(23 23 23), rgb(38 38 38)`,
                    boxShadow: `
                    0 20px 45px rgba(0,0,0,.45),
            inset 0 1px 0 rgba(255,255,255,.06),
            inset 0 -1px 0 rgba(255,255,255,.02)
        `,
                }}
                className="glowing-card max-w-[99%] m-auto w-[360px] h-[380px] xs:w-[210px] xss:h-[280px] xss:w-[230px] xs:h-[240px]  sm:w-[250px] md:w-[300px] lg:w-[250px] md:h-[300px] p-6 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-700  dark:bg-neutral-900 text-neutral-100 cursor-pointer border border-neutral-300 dark:border-neutral-700 rounded-2xl flex flex-col justify-between backdrop-blur-md transition-colors duration-200"
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
                    className="pt-4 border-t shadow-lg border-neutral-700 flex items-center justify-between text-xs text-neutral-500 pointer-events-none"
                    style={{ transform: "translateZ(10px)" }}
                >
                    <span>Double-click to open</span>
                    <span className="text-neutral-400">✦</span>
                </div>
            </motion.div>
        </div>
    );
}