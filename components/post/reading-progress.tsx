"use client"

import { useEffect, useState } from "react"
import { motion, useSpring } from "motion/react"

export function ReadingProgress() {
    const [progress, setProgress] = useState(0)
    const scaleX = useSpring(0, { stiffness: 100, damping: 30 })

    useEffect(() => {
        const update = () => {
            const el = document.documentElement
            const scrollTop = el.scrollTop || document.body.scrollTop
            const scrollHeight = el.scrollHeight - el.clientHeight
            const pct = scrollHeight > 0 ? scrollTop / scrollHeight : 0
            setProgress(pct)
            scaleX.set(pct)
        }
        window.addEventListener("scroll", update, { passive: true })
        return () => window.removeEventListener("scroll", update)
    }, [scaleX])

    return (
        <motion.div
            style={{ scaleX, transformOrigin: "left" }}
            className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-orange-400"
        />
    )
}
