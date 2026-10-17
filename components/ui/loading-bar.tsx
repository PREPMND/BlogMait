"use client"

import { createContext, useContext, useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"

type LoadingState = {
    id: string
    message: string
    status: "loading" | "success" | "error"
}

type LoadingBarContextType = {
    start: (message: string) => string
    success: (id: string, message?: string) => void
    error: (id: string, message?: string) => void
    dismiss: (id: string) => void
}

const LoadingBarContext = createContext<LoadingBarContextType | null>(null)

export function useLoadingBar() {
    const ctx = useContext(LoadingBarContext)
    if (!ctx) throw new Error("useLoadingBar must be used within LoadingBarProvider")
    return ctx
}

export function LoadingBarProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<LoadingState[]>([])
    const counter = useRef(0)

    const start = useCallback((message: string) => {
        const id = `lb-${++counter.current}`
        setItems(prev => [...prev, { id, message, status: "loading" }])
        return id
    }, [])

    const success = useCallback((id: string, message?: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: "success" as const, message: message || i.message } : i))
        setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 2200)
    }, [])

    const error = useCallback((id: string, message?: string) => {
        setItems(prev => prev.map(i => i.id === id ? { ...i, status: "error" as const, message: message || i.message } : i))
        setTimeout(() => setItems(prev => prev.filter(i => i.id !== id)), 4000)
    }, [])

    const dismiss = useCallback((id: string) => {
        setItems(prev => prev.filter(i => i.id !== id))
    }, [])

    return (
        <LoadingBarContext.Provider value={{ start, success, error, dismiss }}>
            {children}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[92%] max-w-md pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {items.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ y: 40, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 20, opacity: 0, scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            className={`pointer-events-auto relative overflow-hidden rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${
                                item.status === "error"
                                    ? "border-red-500/30 bg-red-950/80 text-red-200"
                                    : item.status === "success"
                                    ? "border-emerald-500/30 bg-emerald-950/80 text-emerald-200"
                                    : "border-neutral-700/50 bg-neutral-900/90 text-neutral-200"
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                {item.status === "loading" && (
                                    <div className="relative h-4 w-4 shrink-0">
                                        <div className="absolute inset-0 rounded-full border-2 border-violet-500/30" />
                                        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-violet-400 animate-spin" />
                                    </div>
                                )}
                                {item.status === "success" && (
                                    <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="h-4 w-4 shrink-0 text-emerald-400"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </motion.svg>
                                )}
                                {item.status === "error" && (
                                    <motion.svg
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="h-4 w-4 shrink-0 text-red-400"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </motion.svg>
                                )}
                                <span className="text-sm font-medium truncate">{item.message}</span>
                            </div>
                            {item.status === "loading" && (
                                <motion.div
                                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-violet-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 8, ease: "linear" }}
                                />
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </LoadingBarContext.Provider>
    )
}
