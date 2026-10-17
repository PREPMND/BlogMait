"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { CldUploadWidget } from "next-cloudinary"
import { toast } from "sonner"
import { useLoadingBar } from "@/components/ui/loading-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MarkdownEditor } from "./markdown-editor"
import { TagInput } from "./tag-input"

type PostFormValues = {
    title: string
    description: string
    slug: string
}

interface PostFormProps {
    mode?: "create" | "edit"
    initial?: {
        title: string
        description: string
        slug: string
        content: string
        thumbnail: string
        imageSource: string
        tags: string[]
        isDraft: boolean
        isPublished: boolean
        scheduledAt: string | null
    }
}

export function PostForm({ mode = "create", initial }: PostFormProps) {
    const router = useRouter()
    const loadingBar = useLoadingBar()

    const [content, setContent] = useState(initial?.content ?? "")
    const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
    const [thumbnail, setThumbnail] = useState(initial?.thumbnail ?? "")
    const [imageSource, setImageSource] = useState<"" | "upload" | "ai">(
        (initial?.imageSource as "" | "upload" | "ai") ?? ""
    )
    const [uploading, setUploading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [creating, setCreating] = useState(false)
    const [isDraft, setIsDraft] = useState(initial?.isDraft ?? true)
    const [isPublished, setIsPublished] = useState(initial?.isPublished ?? false)
    const [scheduledAt, setScheduledAt] = useState(initial?.scheduledAt ?? "")
    const [error, setError] = useState("")

    const form = useForm<PostFormValues>({
        defaultValues: {
            title: initial?.title ?? "",
            description: initial?.description ?? "",
            slug: initial?.slug ?? "",
        },
    })

    const autoSlug = () => {
        const title = form.getValues("title")
        if (!title) return
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .slice(0, 80)
        form.setValue("slug", slug)
    }

    const generateAIThumbnail = async () => {
        const title = form.getValues("title")
        const description = form.getValues("description")

        if (!title.trim() || !description.trim()) {
            toast.error("Please enter title and description first.")
            return
        }

        setAiLoading(true)
        try {
            const res = await fetch("/api/ai/thumbnail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, description }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Failed to generate image.")
            setThumbnail(data.image)
            setImageSource("ai")
            toast.success("Thumbnail generated!")
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to generate thumbnail.")
        } finally {
            setAiLoading(false)
        }
    }

    const onSubmit = async (data: PostFormValues) => {
        setError("")
        if (!thumbnail) {
            toast.error("Please upload or generate a thumbnail.")
            return
        }

        const barId = loadingBar.start(mode === "edit" ? "Updating post..." : "Creating post...")
        try {
            setCreating(true)
            const endpoint = mode === "edit" ? `/api/post/${initial?.slug}` : "/api/post"
            const method = mode === "edit" ? "PUT" : "POST"

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    content,
                    thumbnail,
                    imageSource,
                    tags,
                    isDraft,
                    isPublished,
                    scheduledAt: scheduledAt || null,
                }),
            })

            const body = await res.json()
            if (!res.ok) throw new Error(body.message ?? "Failed to save post.")

            loadingBar.success(barId, mode === "edit" ? "Post updated" : "Post published")
            router.push(`/post/${body.post?.slug ?? data.slug}`)
            router.refresh()
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to save post."
            setError(message)
            loadingBar.error(barId, message)
        } finally {
            setCreating(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    placeholder="Enter post title"
                    {...form.register("title", { required: true })}
                    onBlur={() => {
                        if (!form.getValues("slug")) autoSlug()
                    }}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Summary</Label>
                <Textarea
                    id="description"
                    rows={3}
                    placeholder="A brief summary for cards and SEO..."
                    {...form.register("description", { required: true })}
                />
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="slug">Slug</Label>
                    <button type="button" onClick={autoSlug} className="text-xs text-primary hover:underline">
                        Auto-generate
                    </button>
                </div>
                <Input
                    id="slug"
                    placeholder="my-awesome-post"
                    {...form.register("slug", { required: true })}
                />
            </div>

            <div className="space-y-2">
                <Label>Content</Label>
                <MarkdownEditor value={content} onChange={setContent} />
            </div>

            <div className="space-y-2">
                <Label>Tags</Label>
                <TagInput tags={tags} onChange={setTags} />
            </div>

            <div className="space-y-3">
                <Label>Thumbnail</Label>
                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                    onSuccess={(result: any) => {
                        setThumbnail(result.info.secure_url)
                        setImageSource("upload")
                        setUploading(false)
                        toast.success("Thumbnail uploaded.")
                    }}
                    onError={() => {
                        setUploading(false)
                        toast.error("Upload failed.")
                    }}
                >
                    {({ open }) => (
                        <Button
                            type="button"
                            variant="outline"
                            disabled={uploading || aiLoading}
                            onClick={() => { setUploading(true); open() }}
                        >
                            {uploading ? "Uploading..." : "Upload Thumbnail"}
                        </Button>
                    )}
                </CldUploadWidget>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <Button type="button" variant="secondary" disabled={aiLoading} onClick={generateAIThumbnail}>
                    {aiLoading ? "Generating..." : "Generate with AI"}
                </Button>
            </div>

            {thumbnail && (
                <div className="space-y-2">
                    <Label>Thumbnail Preview</Label>
                    <div className="overflow-hidden rounded-xl border">
                        <img src={thumbnail} alt="Thumbnail" className="aspect-video w-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="secondary" disabled={aiLoading || uploading} onClick={generateAIThumbnail}>
                            {aiLoading ? "Generating..." : "Regenerate"}
                        </Button>
                        <Button type="button" variant="destructive" onClick={() => { setThumbnail(""); setImageSource("") }}>
                            Remove
                        </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Source: {imageSource}</p>
                </div>
            )}

            <div className="space-y-3">
                <Label>Status</Label>
                <div className="flex gap-3 flex-wrap">
                    <Button type="button" variant={isDraft && !scheduledAt ? "default" : "outline"}
                        onClick={() => { setIsDraft(true); setIsPublished(false); setScheduledAt("") }}>
                        Draft
                    </Button>
                    <Button type="button" variant={isPublished ? "default" : "outline"}
                        onClick={() => { setIsDraft(false); setIsPublished(true); setScheduledAt("") }}>
                        Publish Now
                    </Button>
                    <Button type="button" variant={scheduledAt ? "default" : "outline"}
                        onClick={() => { setIsDraft(true); setIsPublished(false); setScheduledAt(new Date(Date.now() + 86400000).toISOString().slice(0, 16)) }}>
                        Schedule
                    </Button>
                </div>
                {scheduledAt && (
                    <Input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        className="max-w-xs"
                    />
                )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" className="w-full" disabled={creating}>
                {creating ? "Saving..." : mode === "edit" ? "Update Post" : "Create Post"}
            </Button>
        </form>
    )
}
