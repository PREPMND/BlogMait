import { Queue } from 'bullmq'

let _emailQueue: Queue | null = null
let _analyticsQueue: Queue | null = null
let _publishQueue: Queue | null = null

function getConnection() {
    if (!process.env.REDIS_URL) return null
    try {
        const url = new URL(process.env.REDIS_URL)
        return {
            host: url.hostname,
            port: parseInt(url.port || '6379'),
            password: url.password || undefined,
            username: url.username || undefined,
            tls: url.protocol === 'rediss:' ? {} : undefined,
        }
    } catch {
        return null
    }
}

function getQueue(name: string): Queue | null {
    const conn = getConnection()
    if (!conn) return null
    try {
        return new Queue(name, { connection: conn })
    } catch {
        return null
    }
}

export const emailQueue = {
    async add(name: string, data: any, opts?: any) {
        if (!_emailQueue) _emailQueue = getQueue('email')
        if (!_emailQueue) return null
        return _emailQueue.add(name, data, opts)
    }
}

export const analyticsQueue = {
    async add(name: string, data: any, opts?: any) {
        if (!_analyticsQueue) _analyticsQueue = getQueue('analytics')
        if (!_analyticsQueue) return null
        return _analyticsQueue.add(name, data, opts)
    }
}

export const publishQueue = {
    async add(name: string, data: any, opts?: any) {
        if (!_publishQueue) _publishQueue = getQueue('publish')
        if (!_publishQueue) return null
        return _publishQueue.add(name, data, opts)
    }
}

export function getRawQueue(name: string) {
    return getQueue(name)
}
