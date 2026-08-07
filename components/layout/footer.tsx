"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Sparkles, Cpu, ImageIcon, ArrowUpRight, Link2, GitBranchIcon } from "lucide-react";

export function Footer() {
    return (
        <footer className="relative pt-10 w-full md:w-[90%]  mx-auto h-16  border-t border-white/10 bg-neutral-950">
            {/* Background */}
            <div className="absolute inset-0">
                <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />

                <motion.div
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -20, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="absolute left-1/3 top-1/3 h-60 w-60 rounded-full bg-cyan-400/5 blur-3xl"
                />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative mx-auto max-w-7xl px-6 py-20"
            >
                <div className="grid gap-14 lg:grid-cols-2">
                    {/* Left */}
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: .15 }}
                            className="text-4xl font-bold tracking-tight text-white"
                        >
                            Built for writers.
                            <br />
                            <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                                Powered by AI.
                            </span>
                        </motion.h2>

                        <p className="mt-6 max-w-xl text-neutral-400 leading-7">
                            Create beautiful blogs, generate AI-assisted content,
                            and let background jobs handle image generation while
                            you focus on writing.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {[
                                {
                                    icon: Sparkles,
                                    text: "AI Generation",
                                },
                                {
                                    icon: ImageIcon,
                                    text: "Image Jobs",
                                },
                                {
                                    icon: Cpu,
                                    text: "Background Queue",
                                },
                            ].map((item) => (
                                <motion.div
                                    whileHover={{
                                        y: -4,
                                        scale: 1.04,
                                    }}
                                    key={item.text}
                                    className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-neutral-300 backdrop-blur-xl"
                                >
                                    <item.icon className="h-4 w-4 text-sky-400" />
                                    {item.text}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col justify-between lg:items-end">
                        <div className="space-y-5">
                            <h3 className="text-lg font-semibold text-white">
                                Connect
                            </h3>

                            <Link
                                href="#"
                                className="group flex items-center gap-3 text-neutral-400 transition hover:text-white"
                            >
                                <GitBranchIcon className="h-5 w-5" />
                                GitHub
                                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>

                            <Link
                                href="#"
                                className="group flex items-center gap-3 text-neutral-400 transition hover:text-white"
                            >
                                <Link2 className="h-5 w-5" />
                                LinkedIn
                                <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </Link>
                        </div>

                        <div className="mt-12 text-sm text-neutral-500 lg:text-right">
                            <p>Built with Next.js · Tailwind · Drizzle · PostgreSQL</p>
                            <p className="mt-2">
                                © {new Date().getFullYear()} Your Blog App. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Top Shine */}
            <motion.div
                animate={{
                    x: ["-100%", "120%"],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="pointer-events-none absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
            />
        </footer>
    );
}