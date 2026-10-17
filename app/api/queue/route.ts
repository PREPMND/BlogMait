import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { getRawQueue } from "@/lib/queue"

export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: req.headers })
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

        const names = ["email", "analytics", "publish"]
        const queues: Record<string, any> = {}

        for (const name of names) {
            const q = getRawQueue(name)
            if (!q) {
                queues[name] = { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, status: "disconnected" }
                continue
            }
            try {
                const [waiting, active, completed, failed, delayed] = await Promise.all([
                    q.getWaitingCount(),
                    q.getActiveCount(),
                    q.getCompletedCount(),
                    q.getFailedCount(),
                    q.getDelayedCount(),
                ])
                queues[name] = { waiting, active, completed, failed, delayed, status: "connected" }
            } catch {
                queues[name] = { waiting: 0, active: 0, completed: 0, failed: 0, delayed: 0, status: "error" }
            }
        }

        return NextResponse.json({ queues })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ message: "Failed to fetch queue stats" }, { status: 500 })
    }
}
