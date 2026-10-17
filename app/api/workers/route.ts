import { NextResponse } from "next/server"
import { getRedisConnection } from "@/lib/redis"

let initialized = false

export async function POST() {
    if (initialized) {
        return NextResponse.json({ message: "Workers already running" })
    }

    const conn = getRedisConnection()
    if (!conn) {
        return NextResponse.json({ message: "Redis not configured" }, { status: 503 })
    }

    try {
        const { startEmailWorker, startAnalyticsWorker, startPublishWorker } = await import("@/lib/queue/workers")
        startEmailWorker()
        startAnalyticsWorker()
        startPublishWorker()

        const { getRawQueue } = await import("@/lib/queue")
        const pq = getRawQueue("publish")
        if (pq) {
            await pq.add('scheduled-publish-check', {}, {
                repeat: { every: 60000 },
            } as any)
        }

        initialized = true
        return NextResponse.json({ message: "Workers started", workers: ["email", "analytics", "publish"] })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to start workers" }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({ initialized, redisConfigured: !!getRedisConnection() })
}
