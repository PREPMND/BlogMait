import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, postViews } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { analyticsQueue } from "@/lib/queue"

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
        if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 })

        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown"
        const userAgent = req.headers.get("user-agent") || ""

        const queued = await analyticsQueue.add('track-view', { postId: post.id, ip, userAgent }).catch(() => null)

        if (!queued) {
            await db.insert(postViews).values({ postId: post.id, ip, userAgent }).catch(() => {})
            await db.update(posts)
                .set({ views: (post.views ?? 0) + 1 })
                .where(eq(posts.id, post.id))
        }

        return NextResponse.json({ views: (post.views ?? 0) + 1 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
