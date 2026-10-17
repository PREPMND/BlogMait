import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, tags, postTags, postRevisions } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { calculateReadingTime } from "@/lib/reading-time"
import { emailQueue } from "@/lib/queue"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const post = await db.query.posts.findFirst({
            where: eq(posts.slug, slug),
            with: {
                author: { columns: { name: true, image: true, id: true } },
                tags: { with: { tag: true } },
                revisions: { orderBy: (r, { desc }) => [desc(r.createdAt)], limit: 10 },
            },
        })

        if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })
        return NextResponse.json({ post })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const { slug } = await params
        const existingPost = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
        if (!existingPost) return NextResponse.json({ message: "Post not found" }, { status: 404 })
        if (existingPost.authorId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        const body = await req.json()
        const { title, description, content, slug: newSlug, thumbnail, imageSource, isDraft, isPublished, tags: tagNames, scheduledAt } = body

        let finalThumbnail = thumbnail
        if (typeof thumbnail === "string" && thumbnail.startsWith("data:image")) {
            const uploadResult = await cloudinary.uploader.upload(thumbnail, { folder: "blog-thumbnails" })
            finalThumbnail = uploadResult.secure_url
        }

        if (newSlug && newSlug !== slug) {
            const slugTaken = await db.query.posts.findFirst({ where: eq(posts.slug, newSlug) })
            if (slugTaken) return NextResponse.json({ message: "Slug already exists." }, { status: 409 })
        }

        const readingTime = calculateReadingTime(content || description || "")
        const wasPublished = existingPost.isPublished

        const [updated] = await db.update(posts).set({
            title: title ?? existingPost.title,
            description: description ?? existingPost.description,
            content: content ?? existingPost.content,
            slug: newSlug ?? slug,
            thumbnail: finalThumbnail ?? existingPost.thumbnail,
            imageSource: imageSource ?? existingPost.imageSource,
            isDraft: scheduledAt ? true : (isDraft ?? existingPost.isDraft),
            isPublished: scheduledAt ? false : (isPublished ?? existingPost.isPublished),
            readingTime,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            updatedAt: new Date(),
        }).where(eq(posts.id, existingPost.id)).returning()

        if (tagNames) {
            await db.delete(postTags).where(eq(postTags.postId, existingPost.id))
            for (const name of tagNames) {
                const tagSlug = name.toLowerCase().replace(/\s+/g, "-")
                let tag = await db.query.tags.findFirst({ where: eq(tags.slug, tagSlug) })
                if (!tag) {
                    const [created] = await db.insert(tags).values({ name, slug: tagSlug }).returning()
                    tag = created
                }
                await db.insert(postTags).values({ postId: existingPost.id, tagId: tag.id })
            }
        }

        await db.insert(postRevisions).values({
            postId: existingPost.id,
            title: title ?? existingPost.title,
            content: content ?? existingPost.content ?? "",
            editedBy: session.user.id,
        })

        if (isPublished && !wasPublished) {
            try {
                await emailQueue.add('post-published', {
                    type: 'post_published',
                    data: { email: session.user.email, postTitle: title, postSlug: newSlug ?? slug },
                })
            } catch {}
        }

        return NextResponse.json({ message: "Post updated.", post: updated })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const { slug } = await params
        const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
        if (!post) return NextResponse.json({ message: "Post not found" }, { status: 404 })
        if (post.authorId !== session.user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 })
        }

        await db.delete(posts).where(eq(posts.id, post.id))
        return NextResponse.json({ message: "Post deleted." })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
