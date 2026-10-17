import { Worker } from 'bullmq'
import { getRedisConnection } from '@/lib/redis'
import { sendWelcomeEmail, sendPostPublishedEmail } from '@/lib/email'
import { db } from '@/lib/db'
import { posts, postViews } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export function startEmailWorker() {
    const conn = getRedisConnection()
    if (!conn) return null

    return new Worker('email', async (job) => {
        const { type, data } = job.data
        switch (type) {
            case 'welcome':
                await sendWelcomeEmail(data.email, data.name)
                break
            case 'post_published':
                await sendPostPublishedEmail(data.email, data.postTitle, data.postSlug)
                break
        }
    }, { connection: conn, concurrency: 5 })
}

export function startAnalyticsWorker() {
    const conn = getRedisConnection()
    if (!conn) return null

    return new Worker('analytics', async (job) => {
        const { postId, ip, userAgent } = job.data
        await db.insert(postViews).values({ postId, ip, userAgent })
        const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) })
        if (post) {
            await db.update(posts)
                .set({ views: (post.views ?? 0) + 1 })
                .where(eq(posts.id, postId))
        }
    }, { connection: conn, concurrency: 10 })
}

export function startPublishWorker() {
    const conn = getRedisConnection()
    if (!conn) return null

    return new Worker('publish', async () => {
        const now = new Date()
        const { and, eq: eqFn, lte } = await import('drizzle-orm')
        const scheduled = await db.query.posts.findMany({
            where: and(eqFn(posts.isDraft, true), lte(posts.scheduledAt, now)),
        })
        for (const post of scheduled) {
            await db.update(posts)
                .set({ isPublished: true, isDraft: false, updatedAt: now })
                .where(eq(posts.id, post.id))
        }
    }, { connection: conn, concurrency: 1 })
}
