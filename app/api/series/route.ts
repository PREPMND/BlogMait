import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { postSeries, postSeriesItems, posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const { name, description, postSlugs } = await req.json()
        if (!name || !postSlugs?.length) {
            return NextResponse.json({ message: "Name and posts required" }, { status: 400 })
        }

        const slug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 100)

        const [series] = await db.insert(postSeries).values({
            name,
            slug,
            description: description || null,
            authorId: session.user.id,
        }).returning()

        for (let i = 0; i < postSlugs.length; i++) {
            const post = await db.query.posts.findFirst({ where: eq(posts.slug, postSlugs[i]) })
            if (post) {
                await db.insert(postSeriesItems).values({
                    seriesId: series.id,
                    postId: post.id,
                    order: i + 1,
                })
            }
        }

        return NextResponse.json({ message: "Series created", series }, { status: 201 })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}

export async function GET() {
    try {
        const allSeries = await db.query.postSeries.findMany({
            orderBy: (s, { desc }) => [desc(s.createdAt)],
            with: {
                items: {
                    orderBy: (items, { asc }) => [asc(items.order)],
                    with: { post: { columns: { title: true, slug: true } } },
                },
            },
        })
        return NextResponse.json({ series: allSeries })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
