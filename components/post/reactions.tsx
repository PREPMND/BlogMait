"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react"
import { toast } from "sonner"

const REACTIONS = [
    {
        type: "haunt",
        label: "Haunting",
        spirit: (active: boolean) => (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
                <defs>
                    <radialGradient id="haunt-glow" cx="50%" cy="40%">
                        <stop offset="0%" stopColor={active ? "#c084fc" : "#a78bfa"} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={active ? "#7c3aed" : "#6d28d9"} stopOpacity="0.1" />
                    </radialGradient>
                </defs>
                <path d="M20 4C12 4 6 12 6 20c0 4 1 8 2 11 1 2 2 3 3 1s2-3 3-1 2 3 3 1 2-3 3-1 2 3 3 1 2-3 3-1c1 2 2 0 3-1 1-3 2-7 2-11C36 12 28 4 20 4z"
                    fill="url(#haunt-glow)" className="transition-all duration-500" />
                <circle cx="15" cy="17" r="2.5" fill={active ? "#fff" : "#e2e8f0"}>
                    <animate attributeName="r" values="2.5;3;2.5" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="17" r="2.5" fill={active ? "#fff" : "#e2e8f0"}>
                    <animate attributeName="r" values="2.5;3;2.5" dur="2s" repeatCount="indefinite" begin="0.3s" />
                </circle>
                <ellipse cx="20" cy="24" rx="3" ry="2" fill="none" stroke={active ? "#fff" : "#cbd5e1"} strokeWidth="1.2" opacity="0.6">
                    <animate attributeName="ry" values="2;2.5;2" dur="3s" repeatCount="indefinite" />
                </ellipse>
            </svg>
        ),
    },
    {
        type: "skull",
        label: "Dead",
        spirit: (active: boolean) => (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
                <defs>
                    <radialGradient id="skull-glow" cx="50%" cy="50%">
                        <stop offset="0%" stopColor={active ? "#f8fafc" : "#94a3b8"} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={active ? "#64748b" : "#475569"} stopOpacity="0.3" />
                    </radialGradient>
                </defs>
                <path d="M20 3C11 3 5 10 5 18c0 5 2 9 5 12v4c0 1 1 2 2 2h16c1 0 2-1 2-2v-4c3-3 5-7 5-12 0-8-6-15-15-15z"
                    fill="url(#skull-glow)" className="transition-all duration-500" />
                <ellipse cx="14" cy="16" rx="4" ry="4.5" fill={active ? "#0f172a" : "#334155"}>
                    <animate attributeName="ry" values="4.5;5;4.5" dur="1.5s" repeatCount="indefinite" />
                </ellipse>
                <ellipse cx="26" cy="16" rx="4" ry="4.5" fill={active ? "#0f172a" : "#334155"}>
                    <animate attributeName="ry" values="4.5;5;4.5" dur="1.5s" repeatCount="indefinite" begin="0.2s" />
                </ellipse>
                {active && <>
                    <circle cx="13" cy="15" r="1.2" fill="#ef4444" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="25" cy="15" r="1.2" fill="#ef4444" opacity="0.8">
                        <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                </>}
                <path d="M13 27v5M17 27v5M23 27v5M27 27v5" stroke={active ? "#0f172a" : "#475569"} strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 23q4 3 8 0" fill="none" stroke={active ? "#0f172a" : "#475569"} strokeWidth="1.2" />
            </svg>
        ),
    },
    {
        type: "void",
        label: "Abyss",
        spirit: (active: boolean) => (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
                <defs>
                    <radialGradient id="void-glow" cx="50%" cy="50%">
                        <stop offset="0%" stopColor={active ? "#1e1b4b" : "#312e81"} stopOpacity="0.9" />
                        <stop offset="50%" stopColor={active ? "#4338ca" : "#4f46e5"} stopOpacity="0.5" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>
                <circle cx="20" cy="20" r="15" fill="url(#void-glow)" className="transition-all duration-500">
                    <animate attributeName="r" values="15;16;14;15" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="20" cy="20" r="8" fill={active ? "#020617" : "#1e1b4b"}>
                    <animate attributeName="r" values="8;9;7;8" dur="2s" repeatCount="indefinite" />
                </circle>
                {active && <>
                    <circle cx="20" cy="20" r="12" fill="none" stroke="#818cf8" strokeWidth="0.5" opacity="0.5">
                        <animate attributeName="r" values="12;16;12" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="20" cy="20" r="10" fill="none" stroke="#a5b4fc" strokeWidth="0.3" opacity="0.3">
                        <animate attributeName="r" values="10;18;10" dur="3s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.3;0;0.3" dur="3s" repeatCount="indefinite" />
                    </circle>
                </>}
                <circle cx="17" cy="18" r="1" fill="#c7d2fe" opacity="0.8">
                    <animate attributeName="cy" values="18;22;18" dur="4s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0;0.8" dur="4s" repeatCount="indefinite" />
                </circle>
                <circle cx="24" cy="22" r="0.8" fill="#e0e7ff" opacity="0.6">
                    <animate attributeName="cy" values="22;18;22" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="3s" repeatCount="indefinite" />
                </circle>
            </svg>
        ),
    },
    {
        type: "flame",
        label: "Scorched",
        spirit: (active: boolean) => (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
                <defs>
                    <linearGradient id="flame-grad" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0%" stopColor={active ? "#dc2626" : "#b91c1c"} />
                        <stop offset="50%" stopColor={active ? "#f97316" : "#c2410c"} />
                        <stop offset="100%" stopColor={active ? "#fbbf24" : "#d97706"} />
                    </linearGradient>
                </defs>
                <path d="M20 2c-3 8-10 12-10 22 0 8 5 14 10 14s10-6 10-14C30 14 23 10 20 2z" fill="url(#flame-grad)" className="transition-all duration-500">
                    <animate attributeName="d"
                        values="M20 2c-3 8-10 12-10 22 0 8 5 14 10 14s10-6 10-14C30 14 23 10 20 2z;M20 4c-4 6-11 13-11 20 0 9 6 14 11 14s11-5 11-14C31 17 24 10 20 4z;M20 2c-3 8-10 12-10 22 0 8 5 14 10 14s10-6 10-14C30 14 23 10 20 2z"
                        dur="1.5s" repeatCount="indefinite" />
                </path>
                <path d="M20 18c-1 4-4 6-4 10 0 3 2 6 4 6s4-3 4-6c0-4-3-6-4-10z"
                    fill={active ? "#fef3c7" : "#fde68a"} opacity="0.8">
                    <animate attributeName="opacity" values="0.8;0.5;0.8" dur="0.8s" repeatCount="indefinite" />
                </path>
                {active && <>
                    <circle cx="16" cy="24" r="1.5" fill="#fff" opacity="0.6">
                        <animate attributeName="cy" values="24;20;24" dur="1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="24" cy="22" r="1" fill="#fde68a" opacity="0.5">
                        <animate attributeName="cy" values="22;18;22" dur="1.2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.2s" repeatCount="indefinite" />
                    </circle>
                </>}
            </svg>
        ),
    },
    {
        type: "phantom",
        label: "Wraith",
        spirit: (active: boolean) => (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
                <defs>
                    <linearGradient id="wraith-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={active ? "#475569" : "#334155"} stopOpacity="0.9" />
                        <stop offset="100%" stopColor={active ? "#1e293b" : "#0f172a"} stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                <path d="M20 3C13 3 8 8 8 14v12c0 0 0 4 2 6s3 2 4 0 1-4 2-4 2 4 4 4 2-2 4-4 2 4 4 4 2-2 2-4V14C30 8 27 3 20 3z"
                    fill="url(#wraith-grad)" className="transition-all duration-700">
                    <animate attributeName="d"
                        values="M20 3C13 3 8 8 8 14v12c0 0 0 4 2 6s3 2 4 0 1-4 2-4 2 4 4 4 2-2 4-4 2 4 4 4 2-2 2-4V14C30 8 27 3 20 3z;M20 5C14 5 9 9 9 15v10c0 0 1 5 2 5s2-3 3-3 2 5 3 5 2-3 3-3 2 5 3 5 3-3 3-5V15C30 9 26 5 20 5z;M20 3C13 3 8 8 8 14v12c0 0 0 4 2 6s3 2 4 0 1-4 2-4 2 4 4 4 2-2 4-4 2 4 4 4 2-2 2-4V14C30 8 27 3 20 3z"
                        dur="4s" repeatCount="indefinite" />
                </path>
                <circle cx="15" cy="14" r="3" fill={active ? "#e2e8f0" : "#94a3b8"}>
                    <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="14" r="3" fill={active ? "#e2e8f0" : "#94a3b8"}>
                    <animate attributeName="opacity" values="1;0.4;1" dur="3s" repeatCount="indefinite" begin="1s" />
                </circle>
                <circle cx="15" cy="13.5" r="1.5" fill={active ? "#0f172a" : "#1e293b"} />
                <circle cx="25" cy="13.5" r="1.5" fill={active ? "#0f172a" : "#1e293b"} />
                {active && <path d="M14 20q6 3 12 0" fill="none" stroke="#94a3b8" strokeWidth="0.8" opacity="0.5">
                    <animate attributeName="d" values="M14 20q6 3 12 0;M14 20q6 5 12 0;M14 20q6 3 12 0" dur="2s" repeatCount="indefinite" />
                </path>}
            </svg>
        ),
    },
    {
        type: "eclipse",
        label: "Eclipse",
        spirit: (active: boolean) => (
            <svg viewBox="0 0 40 40" className="w-8 h-8">
                <defs>
                    <radialGradient id="eclipse-corona" cx="50%" cy="50%">
                        <stop offset="70%" stopColor="transparent" />
                        <stop offset="85%" stopColor={active ? "#f59e0b" : "#d97706"} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={active ? "#fbbf24" : "#f59e0b"} stopOpacity="0" />
                    </radialGradient>
                </defs>
                <circle cx="20" cy="20" r="18" fill="url(#eclipse-corona)">
                    <animate attributeName="r" values="18;19;17;18" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="20" cy="20" r="12" fill={active ? "#0c0a09" : "#1c1917"} />
                <circle cx="23" cy="18" r="10" fill={active ? "#020617" : "#0f172a"} />
                {active && <>
                    <circle cx="14" cy="14" r="0.8" fill="#fde68a" opacity="0.7">
                        <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="28" cy="12" r="0.5" fill="#fef3c7" opacity="0.5">
                        <animate attributeName="opacity" values="0.5;0;0.5" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
                    </circle>
                    <circle cx="12" cy="26" r="0.6" fill="#fcd34d" opacity="0.4">
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" begin="1s" />
                    </circle>
                    <circle cx="30" cy="24" r="0.4" fill="#fef9c3" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0;0.6" dur="1.8s" repeatCount="indefinite" begin="0.3s" />
                    </circle>
                </>}
            </svg>
        ),
    },
]

interface ReactionsProps {
    slug: string
}

export function Reactions({ slug }: ReactionsProps) {
    const [counts, setCounts] = useState<Record<string, number>>({})
    const [userReactions, setUserReactions] = useState<string[]>([])
    const [bursting, setBursting] = useState<string | null>(null)

    useEffect(() => {
        fetch(`/api/post/${slug}/reactions`)
            .then(r => r.json())
            .then(data => {
                setCounts(data.counts || {})
                setUserReactions(data.userReactions || [])
            })
            .catch(() => {})
    }, [slug])

    const toggle = async (type: string) => {
        setBursting(type)
        setTimeout(() => setBursting(null), 800)

        try {
            const res = await fetch(`/api/post/${slug}/reactions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            })
            if (!res.ok) {
                const data = await res.json()
                toast.error(data.message || "Failed")
                return
            }
            const data = await res.json()
            if (data.action === "added") {
                setCounts(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }))
                setUserReactions(prev => [...prev, type])
            } else {
                setCounts(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) - 1) }))
                setUserReactions(prev => prev.filter(r => r !== type))
            }
        } catch {
            toast.error("Something went wrong")
        }
    }

    const total = Object.values(counts).reduce((s, c) => s + c, 0)

    return (
        <div className="py-10 border-t border-border">
            <p className="text-[11px] text-muted-foreground mb-5 tracking-[0.2em] uppercase font-medium">
                {total > 0 ? `${total} soul${total === 1 ? "" : "s"} left a mark` : "Summon a spirit"}
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
                {REACTIONS.map(r => {
                    const isActive = userReactions.includes(r.type)
                    const count = counts[r.type] || 0

                    return (
                        <motion.button
                            key={r.type}
                            type="button"
                            onClick={() => toggle(r.type)}
                            whileHover={{ scale: 1.08, y: -3 }}
                            whileTap={{ scale: 0.9 }}
                            className="relative group"
                            title={r.label}
                        >
                            <div className={`
                                relative flex flex-col items-center gap-1 px-2 sm:px-3 py-2 sm:py-3 rounded-2xl border transition-all duration-500 cursor-pointer
                                ${isActive
                                    ? "border-white/15 dark:border-white/10 bg-white/5 dark:bg-white/[0.03] shadow-lg"
                                    : "border-transparent hover:border-white/10 dark:hover:border-white/5 bg-transparent hover:bg-white/[0.02]"
                                }
                            `}>
                                <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"}`}>
                                    {r.spirit(isActive)}
                                </div>

                                <span className={`text-[10px] tracking-wide transition-colors duration-300 ${
                                    isActive ? "text-foreground/80" : "text-muted-foreground/60 group-hover:text-muted-foreground"
                                }`}>
                                    {r.label}
                                </span>

                                <AnimatePresence>
                                    {count > 0 && (
                                        <motion.span
                                            key={count}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            className={`absolute -top-1.5 -right-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-[10px] font-mono px-1.5 ${
                                                isActive
                                                    ? "bg-foreground text-background"
                                                    : "bg-muted text-muted-foreground"
                                            }`}
                                        >
                                            {count}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>

                            <AnimatePresence>
                                {bursting === r.type && (
                                    <>
                                        {[...Array(6)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                                animate={{
                                                    scale: [0, 1, 0],
                                                    x: Math.cos((i * 60) * Math.PI / 180) * 40,
                                                    y: Math.sin((i * 60) * Math.PI / 180) * 40 - 10,
                                                    opacity: [1, 0.6, 0],
                                                }}
                                                transition={{ duration: 0.7, ease: "easeOut" }}
                                                className="absolute top-1/2 left-1/2 w-1.5 h-1.5 rounded-full bg-foreground/30 pointer-events-none"
                                            />
                                        ))}
                                    </>
                                )}
                            </AnimatePresence>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}
