import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, postRevisions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
        if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 })

        const revisions = await db.query.postRevisions.findMany({
            where: eq(postRevisions.postId, post.id),
            orderBy: (r, { desc }) => [desc(r.createdAt)],
            with: { editor: { columns: { name: true, image: true } } },
        })

        return NextResponse.json({ revisions })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
