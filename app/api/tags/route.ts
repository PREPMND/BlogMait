import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const allTags = await db.query.tags.findMany({
            orderBy: (tags, { asc }) => [asc(tags.name)],
        })
        return NextResponse.json({ tags: allTags })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
    }
}
