"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { PostForm } from "@/components/post/post-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EditPost() {
    const params = useParams()
    const slug = params.slug as string
    const [post, setPost] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`/api/post/${slug}`)
            .then(r => r.json())
            .then(data => {
                setPost(data.post)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [slug])

    if (loading) return <div className="flex justify-center py-20 text-muted-foreground">Loading...</div>
    if (!post) return <div className="flex justify-center py-20 text-muted-foreground">Post not found</div>

    return (
        <div className="py-10">
            <div className="max-w-4xl mx-auto">
                <Card className="w-[90%] mx-auto">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-medium">Edit Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <PostForm
                            mode="edit"
                            initial={{
                                title: post.title,
                                description: post.description,
                                slug: post.slug,
                                content: post.content || "",
                                thumbnail: post.thumbnail,
                                imageSource: post.imageSource || "",
                                tags: post.tags?.map((pt: any) => pt.tag?.name).filter(Boolean) || [],
                                isDraft: post.isDraft ?? true,
                                isPublished: post.isPublished ?? false,
                                scheduledAt: post.scheduledAt ? new Date(post.scheduledAt).toISOString().slice(0, 16) : null,
                            }}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
