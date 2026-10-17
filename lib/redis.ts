import Redis from 'ioredis'

let _redis: Redis | null = null

export function getRedis() {
    if (_redis) return _redis
    const url = process.env.REDIS_URL
    if (!url) return null

    try {
        _redis = new Redis(url, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            retryStrategy(times) {
                if (times > 3) return null
                return Math.min(times * 200, 2000)
            },
        })
        return _redis
    } catch {
        return null
    }
}

export function getRedisConnection() {
    const url = process.env.REDIS_URL
    if (!url) return null
    try {
        const parsed = new URL(url)
        return {
            host: parsed.hostname,
            port: parseInt(parsed.port || '6379'),
            password: parsed.password || undefined,
            username: parsed.username || undefined,
            tls: parsed.protocol === 'rediss:' ? {} : undefined,
        }
    } catch {
        return null
    }
}
