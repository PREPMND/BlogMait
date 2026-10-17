export default function Loading() {
    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="space-y-4 mb-8">
                <div className="flex gap-2">
                    <div className="h-6 w-14 rounded-full bg-muted animate-pulse" />
                    <div className="h-6 w-18 rounded-full bg-muted animate-pulse" />
                </div>
                <div className="h-9 w-4/5 bg-muted animate-pulse rounded" />
                <div className="h-5 w-full bg-muted animate-pulse rounded" />
                <div className="flex items-center gap-3 pb-6 border-b border-border">
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse shrink-0" />
                    <div className="space-y-2">
                        <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                        <div className="h-3 w-40 bg-muted animate-pulse rounded" />
                    </div>
                </div>
                <div className="aspect-video w-full bg-muted animate-pulse rounded-xl" />
            </div>
            <div className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-muted animate-pulse rounded" style={{ width: `${70 + Math.random() * 30}%` }} />
                ))}
            </div>
        </div>
    )
}
