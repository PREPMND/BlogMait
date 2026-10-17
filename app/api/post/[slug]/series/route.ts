import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { posts, postSeriesItems } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
        if (!post) return NextResponse.json({ series: null })

        const seriesItem = await db.query.postSeriesItems.findFirst({
            where: eq(postSeriesItems.postId, post.id),
            with: {
                series: {
                    with: {
                        items: {
                            orderBy: (items, { asc }) => [asc(items.order)],
                            with: { post: { columns: { slug: true, title: true } } },
                        },
                    },
                },
            },
        })

        if (!seriesItem) return NextResponse.json({ series: null })

        const currentIndex = seriesItem.series.items.findIndex(i => i.postId === post.id)

        return NextResponse.json({
            series: {
                name: seriesItem.series.name,
                items: seriesItem.series.items,
                currentIndex,
            },
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ series: null })
    }
}
