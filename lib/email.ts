import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'Blog <onboarding@resend.dev>'

export async function sendWelcomeEmail(to: string, name: string) {
    return resend.emails.send({
        from: FROM,
        to,
        subject: `Welcome to the blog, ${name}!`,
        html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="font-size: 24px; font-weight: 600; color: #111;">Welcome, ${name}</h1>
                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                    Your account is ready. Start writing your first post or explore what others have shared.
                </p>
                <a href="${process.env.BASE_URL}/post/create"
                   style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #111; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px;">
                    Write your first post
                </a>
            </div>
        `,
    })
}

export async function sendPostPublishedEmail(to: string, postTitle: string, postSlug: string) {
    await resend.emails.send({
        from: FROM,
        to,
        subject: `Your post "${postTitle}" is now live`,
        html: `
            <div style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 20px;">
                <h1 style="font-size: 24px; font-weight: 600; color: #111;">${postTitle}</h1>
                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                    Your post has been published and is now visible to readers.
                </p>
                <a href="${process.env.BASE_URL}/post/${postSlug}"
                   style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #111; color: #fff; border-radius: 8px; text-decoration: none; font-size: 14px;">
                    View your post
                </a>
            </div>
        `,
    })
}
