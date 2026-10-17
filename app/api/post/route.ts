import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, tags, postTags, postRevisions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { calculateReadingTime } from "@/lib/reading-time"
import { emailQueue } from "@/lib/queue"

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const body = await req.json()
        const { title, description, content, slug, thumbnail, imageSource, isDraft, isPublished, tags: tagNames, scheduledAt } = body

        if (!title || !description || !slug) {
            return NextResponse.json({ message: "Please fill all required fields." }, { status: 400 })
        }

        let finalThumbnail = thumbnail
        if (typeof thumbnail === "string" && thumbnail.startsWith("data:image")) {
            const uploadResult = await cloudinary.uploader.upload(thumbnail, { folder: "blog-thumbnails" })
            finalThumbnail = uploadResult.secure_url
        }

        const existingPost = await db.query.posts.findFirst({
            where: (posts, { eq }) => eq(posts.slug, slug),
        })
        if (existingPost) {
            return NextResponse.json({ message: "Slug already exists." }, { status: 409 })
        }

        const readingTime = calculateReadingTime(content || description)

        const [createdPost] = await db.insert(posts).values({
            title,
            description,
            content: content || "",
            slug,
            thumbnail: finalThumbnail,
            imageSource: imageSource ?? "ai",
            isDraft: scheduledAt ? true : isDraft,
            isPublished: scheduledAt ? false : isPublished,
            readingTime,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
            authorId: session.user.id,
        }).returning()

        if (tagNames?.length) {
            for (const name of tagNames) {
                const tagSlug = name.toLowerCase().replace(/\s+/g, "-")
                let tag = await db.query.tags.findFirst({ where: eq(tags.slug, tagSlug) })
                if (!tag) {
                    const [created] = await db.insert(tags).values({ name, slug: tagSlug }).returning()
                    tag = created
                }
                await db.insert(postTags).values({ postId: createdPost.id, tagId: tag.id })
            }
        }

        await db.insert(postRevisions).values({
            postId: createdPost.id,
            title,
            content: content || "",
            editedBy: session.user.id,
        })

        if (isPublished && !scheduledAt) {
            try {
                await emailQueue.add('post-published', {
                    type: 'post_published',
                    data: { email: session.user.email, postTitle: title, postSlug: slug },
                })
            } catch {}
        }

        return NextResponse.json({ message: "Post created.", post: createdPost }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const tag = searchParams.get("tag")
        const page = parseInt(searchParams.get("page") || "1")
        const limit = parseInt(searchParams.get("limit") || "12")
        const offset = (page - 1) * limit

        let allPosts

        if (tag) {
            const tagRecord = await db.query.tags.findFirst({ where: eq(tags.slug, tag) })
            if (!tagRecord) return NextResponse.json({ posts: [], total: 0 })

            const taggedPostIds = await db.query.postTags.findMany({
                where: eq(postTags.tagId, tagRecord.id),
            })
            const ids = taggedPostIds.map(tp => tp.postId)
            if (!ids.length) return NextResponse.json({ posts: [], total: 0 })

            allPosts = await db.query.posts.findMany({
                where: (posts, { and, eq, inArray }) =>
                    and(eq(posts.isPublished, true), inArray(posts.id, ids)),
                orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                limit,
                offset,
                with: { author: { columns: { name: true, image: true } } },
            })
        } else {
            allPosts = await db.query.posts.findMany({
                where: (posts, { eq }) => eq(posts.isPublished, true),
                orderBy: (posts, { desc }) => [desc(posts.createdAt)],
                limit,
                offset,
                with: { author: { columns: { name: true, image: true } } },
            })
        }

        return NextResponse.json({ posts: allPosts })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
