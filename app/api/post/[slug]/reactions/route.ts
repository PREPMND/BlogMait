import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts, postReactions } from "@/lib/db/schema"
import { eq, and, sql } from "drizzle-orm"

const REACTION_TYPES = ["haunt", "skull", "void", "flame", "phantom", "eclipse"]

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
        if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 })

        const reactions = await db
            .select({
                type: postReactions.type,
                count: sql<number>`count(*)::int`,
            })
            .from(postReactions)
            .where(eq(postReactions.postId, post.id))
            .groupBy(postReactions.type)

        const session = await auth.api.getSession({ headers: req.headers }).catch(() => null)
        let userReactions: string[] = []
        if (session?.user) {
            const mine = await db.query.postReactions.findMany({
                where: and(eq(postReactions.postId, post.id), eq(postReactions.userId, session.user.id)),
            })
            userReactions = mine.map(r => r.type)
        }

        const counts: Record<string, number> = {}
        for (const t of REACTION_TYPES) counts[t] = 0
        for (const r of reactions) counts[r.type] = r.count

        return NextResponse.json({ counts, userReactions })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) return NextResponse.json({ message: "Login to react" }, { status: 401 })

        const { slug } = await params
        const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
        if (!post) return NextResponse.json({ message: "Not found" }, { status: 404 })

        const { type } = await req.json()
        if (!REACTION_TYPES.includes(type)) {
            return NextResponse.json({ message: "Invalid reaction" }, { status: 400 })
        }

        const existing = await db.query.postReactions.findFirst({
            where: and(
                eq(postReactions.postId, post.id),
                eq(postReactions.userId, session.user.id),
                eq(postReactions.type, type),
            ),
        })

        if (existing) {
            await db.delete(postReactions).where(eq(postReactions.id, existing.id))
            return NextResponse.json({ action: "removed", type })
        }

        await db.insert(postReactions).values({
            postId: post.id,
            userId: session.user.id,
            type,
        })

        return NextResponse.json({ action: "added", type })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
