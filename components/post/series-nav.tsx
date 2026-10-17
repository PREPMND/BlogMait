"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface SeriesNavProps {
    slug: string
}

interface SeriesData {
    name: string
    items: { order: number; post: { slug: string; title: string } }[]
    currentIndex: number
}

export function SeriesNav({ slug }: SeriesNavProps) {
    const [series, setSeries] = useState<SeriesData | null>(null)

    useEffect(() => {
        fetch(`/api/post/${slug}/series`)
            .then(r => r.json())
            .then(data => {
                if (data.series) setSeries(data.series)
            })
            .catch(() => {})
    }, [slug])

    if (!series) return null

    const prev = series.currentIndex > 0 ? series.items[series.currentIndex - 1] : null
    const next = series.currentIndex < series.items.length - 1 ? series.items[series.currentIndex + 1] : null

    return (
        <div className="py-6 border-t border-border">
            <div className="rounded-xl border border-border p-5 bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Part of a series</p>
                <h4 className="font-semibold text-foreground mb-3">{series.name}</h4>

                <div className="space-y-1.5 mb-4">
                    {series.items.map((item, i) => (
                        <Link
                            key={item.post.slug}
                            href={`/post/${item.post.slug}`}
                            className={`block text-sm px-3 py-1.5 rounded-md transition-colors ${
                                i === series.currentIndex
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            }`}
                        >
                            <span className="text-xs opacity-50 mr-2">#{item.order}</span>
                            {item.post.title}
                        </Link>
                    ))}
                </div>

                <div className="flex justify-between gap-4">
                    {prev ? (
                        <Link href={`/post/${prev.post.slug}`} className="text-sm text-primary hover:underline">
                            ← {prev.post.title}
                        </Link>
                    ) : <span />}
                    {next ? (
                        <Link href={`/post/${next.post.slug}`} className="text-sm text-primary hover:underline text-right">
                            {next.post.title} →
                        </Link>
                    ) : <span />}
                </div>
            </div>
        </div>
    )
}
