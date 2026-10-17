import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sendWelcomeEmail } from "@/lib/email"
import { emailQueue } from "@/lib/queue"

export async function POST(req: NextRequest) {
    try {
        let email: string
        let name: string

        const body = await req.json().catch(() => null)

        if (body?.email && body?.name) {
            email = body.email
            name = body.name
        } else {
            const session = await auth.api.getSession({ headers: req.headers })
            if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
            email = session.user.email
            name = session.user.name
        }

        const queued = await emailQueue.add('welcome', {
            type: 'welcome',
            data: { email, name },
        }).catch(() => null)

        if (!queued) {
            const result = await sendWelcomeEmail(email, name)
            if (result.error) {
                console.error("Resend error:", result.error)
                return NextResponse.json({ message: result.error.message }, { status: 500 })
            }
        }

        return NextResponse.json({ message: "Welcome email sent" })
    } catch (error) {
        console.error("Welcome email error:", error)
        return NextResponse.json({ message: "Failed", error: String(error) }, { status: 500 })
    }
}
