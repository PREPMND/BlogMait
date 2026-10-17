"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import Perfect3DTiltCard from "@/components/ui/card-tactical"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
    const { data: session, isPending } = useSession()
    const router = useRouter()
    const [posts, setPosts] = useState<any[]>([])
    const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, totalViews: 0 })

    useEffect(() => {
        if (!session?.user) return
        fetch("/api/profile/posts")
            .then(r => r.json())
            .then(data => {
                const all = data.posts || []
                setPosts(all)
                setStats({
                    total: all.length,
                    published: all.filter((p: any) => p.isPublished).length,
                    drafts: all.filter((p: any) => p.isDraft).length,
                    totalViews: all.reduce((sum: number, p: any) => sum + (p.views || 0), 0),
                })
            })
    }, [session])

    if (isPending) return <div className="flex justify-center py-20 text-muted-foreground">Loading...</div>
    if (!session?.user) {
        router.push("/auth")
        return null
    }

    return (
        <div className="py-10 px-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                {session.user.image && (
                    <img src={session.user.image} alt={session.user.name} className="w-16 h-16 rounded-full" />
                )}
                <div>
                    <h1 className="text-2xl font-semibold">{session.user.name}</h1>
                    <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Total Posts", value: stats.total },
                    { label: "Published", value: stats.published },
                    { label: "Drafts", value: stats.drafts },
                    { label: "Total Views", value: stats.totalViews },
                ].map(s => (
                    <div key={s.label} className="border border-border rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Your Posts</h2>
                <Button onClick={() => router.push("/post/create")}>New Post</Button>
            </div>

            {posts.length === 0 ? (
                <p className="text-muted-foreground">No posts yet.</p>
            ) : (
                <div className="grid xs:grid-cols-2 lg:grid-cols-3 gap-10">
                    {posts.map((post: any) => (
                        <div key={post.id} className="relative group">
                            <Perfect3DTiltCard
                                id={post.id}
                                slug={post.slug}
                                title={post.title}
                                description={post.description}
                                thumbnail={post.thumbnail}
                                image={session.user.image}
                                username={session.user.name}
                                href={`/post/${post.slug}`}
                            />
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button size="sm" variant="secondary" onClick={() => router.push(`/post/edit/${post.slug}`)}>
                                    Edit
                                </Button>
                            </div>
                            <div className="flex justify-between mt-2 px-1 text-xs text-muted-foreground">
                                <span>{post.isPublished ? "Published" : post.scheduledAt ? "Scheduled" : "Draft"}</span>
                                <span>{post.views ?? 0} views</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
