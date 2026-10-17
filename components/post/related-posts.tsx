"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

interface RelatedPostsProps {
    slug: string
    tags: string[]
}

export function RelatedPosts({ slug, tags }: RelatedPostsProps) {
    const [posts, setPosts] = useState<any[]>([])

    useEffect(() => {
        if (!tags.length) return
        fetch(`/api/post?tag=${tags[0]}&limit=4`)
            .then(r => r.json())
            .then(data => {
                setPosts((data.posts || []).filter((p: any) => p.slug !== slug).slice(0, 3))
            })
            .catch(() => {})
    }, [slug, tags])

    if (!posts.length) return null

    return (
        <div className="py-10 border-t border-border">
            <h3 className="text-lg font-semibold mb-6 tracking-tight">More like this</h3>
            <div className="grid gap-4 sm:grid-cols-3">
                {posts.map((post: any) => (
                    <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        className="group block rounded-xl border border-border p-4 hover:bg-muted/50 transition-colors"
                    >
                        {post.thumbnail && (
                            <div className="overflow-hidden rounded-lg mb-3">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        )}
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {post.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{post.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-muted-foreground">
                            <span>{post.author?.name}</span>
                            <span>·</span>
                            <span>{post.readingTime || 1} min</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
