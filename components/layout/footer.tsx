"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
    Sparkles,
    Cpu,
    ImageIcon,
    ArrowUpRight,
    LinkIcon,
    GitBranchIcon,
   
} from "lucide-react";

export function Footer() {
    const features = [
        { icon: Sparkles, text: "AI Generation" },
        { icon: ImageIcon, text: "Image Jobs" },
        { icon: Cpu, text: "Background Queue" },
    ];

    return (
        <footer className="relative mt-20 overflow-hidden border-t border-neutral-200 bg-neutral-50 dark:border-white/10 dark:bg-neutral-950">
            {/* Background */}
            <div className="absolute inset-0  overflow-hidden">
                <div className="absolute -left-24 top-0 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl dark:bg-sky-500/10" />

                <div className="absolute -right-24 bottom-0 h-52 w-52 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />

                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:42px_42px] opacity-40 dark:opacity-20" />
            </div>

            {/* Top Shine */}
            <motion.div
                animate={{ x: ["-100%", "120%"] }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="pointer-events-none absolute top-0 h-px w-1/3 bg-gradient-to-r from-transparent via-sky-400 to-transparent"
            />

            <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative mx-auto max-w-7xl px-6 py-10 md:py-16"
            >
                <div className="grid gap-10 lg:grid-cols-2">
                    {/* Left */}
                    <div className="text-center lg:text-left">
                        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-4xl">
                            Built for writers.
                            <br />
                            <span className="bg-gradient-to-r from-sky-500 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                                Powered by AI.
                            </span>
                        </h2>

                        <p className="mx-auto mt-2 max-w-xl text-sm leading-7 text-neutral-600 dark:text-neutral-400 lg:mx-0 md:text-base">
                            Create, edit and publish blogs with AI-assisted
                            writing while background jobs seamlessly generate
                            stunning images for every story.
                        </p>

                        <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
                            {features.map((item) => (
                                <motion.div
                                    key={item.text}
                                    whileHover={{
                                        y: -2,
                                        scale: 1.03,
                                    }}
                                    className="flex items-center gap-2 rounded-full border border-neutral-300 bg-white/70 px-3 py-2 text-xs text-neutral-700 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-neutral-300 sm:text-sm"
                                >
                                    <item.icon className="h-4 w-4 text-sky-500" />
                                    {item.text}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right */}
                    <div className="flex flex-col items-center justify-between text-center lg:items-end lg:text-right">
                        <div>
                            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
                                Connect
                            </h3>

                            <div className="space-y-3">
                                <Link
                                    href="#"
                                    className="group flex items-center justify-center gap-3 text-neutral-600 transition hover:text-sky-500 dark:text-neutral-400 dark:hover:text-white lg:justify-end"
                                >
                                    <GitBranchIcon className="h-5 w-5" />
                                    GitHub
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                </Link>

                                <Link
                                    href="#"
                                    className="group flex items-center justify-center gap-3 text-neutral-600 transition hover:text-sky-500 dark:text-neutral-400 dark:hover:text-white lg:justify-end"
                                >
                                    <LinkIcon className="h-5 w-5" />
                                    LinkedIn
                                    <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-10 border-t border-neutral-300 pt-6 text-sm text-neutral-500 dark:border-white/10 dark:text-neutral-500 lg:w-fit">
                            <p>
                                Built with{" "}
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                    Next.js
                                </span>{" "}
                                ·{" "}
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                    Drizzle
                                </span>{" "}
                                ·{" "}
                                <span className="font-medium text-neutral-700 dark:text-neutral-300">
                                    PostgreSQL
                                </span>
                            </p>

                            <p className="mt-2">
                                © {new Date().getFullYear()} Your Blog App. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </footer>
    );
}