export default function Loading() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 space-y-2">
                        <div className="h-8 w-12 bg-muted animate-pulse rounded" />
                        <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                    </div>
                ))}
            </div>
            <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border p-4 flex items-center gap-4">
                        <div className="h-16 w-24 bg-muted animate-pulse rounded shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
