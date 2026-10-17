import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const userPosts = await db.query.posts.findMany({
            where: eq(posts.authorId, session.user.id),
            orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        })

        return NextResponse.json({ posts: userPosts })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
