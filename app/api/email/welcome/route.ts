import { NextRequest, NextResponse } from "next/server"
import { sendWelcomeEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null)
        if (!body?.email || !body?.name) {
            return NextResponse.json({ message: "Email and name required" }, { status: 400 })
        }

        await sendWelcomeEmail(body.email, body.name)
        return NextResponse.json({ message: "Welcome email sent" })
    } catch (error) {
        console.error("Welcome email error:", error)
        return NextResponse.json({ message: "Failed to send email", error: String(error) }, { status: 500 })
    }
}
