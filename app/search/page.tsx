"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Perfect3DTiltCard from "@/components/ui/card-tactical"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const tag = searchParams.get("tag") || ""
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!query && !tag) return
        setLoading(true)
        const params = new URLSearchParams()
        if (tag) params.set("tag", tag)
        fetch(`/api/post?${params.toString()}`)
            .then(r => r.json())
            .then(data => {
                let results = data.posts || []
                if (query) {
                    const q = query.toLowerCase()
                    results = results.filter((p: any) =>
                        p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
                    )
                }
                setPosts(results)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [query, tag])

    return (
        <div className="py-10 px-4">
            <h1 className="text-2xl font-semibold mb-6">
                {tag ? `Posts tagged "${tag}"` : query ? `Results for "${query}"` : "Search"}
            </h1>
            {loading ? (
                <p className="text-muted-foreground">Searching...</p>
            ) : posts.length === 0 ? (
                <p className="text-muted-foreground">{query || tag ? "No posts found." : "Enter a search term."}</p>
            ) : (
                <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post: any) => (
                        <Perfect3DTiltCard
                            key={post.id}
                            id={post.id}
                            slug={post.slug}
                            title={post.title}
                            description={post.description}
                            thumbnail={post.thumbnail}
                            image={post.author?.image}
                            username={post.author?.name}
                            href={`/post/${post.slug}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
