export default function Loading() {
    return (
        <div className="py-6 px-4">
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-7 w-16 rounded-full bg-muted animate-pulse" />
                ))}
            </div>
            <div className="grid xs:grid-cols-2 lg:grid-cols-3 mb-10 mt-4 place-items-evenly gap-10 md:gap-12 lg:gap-10">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-border overflow-hidden">
                        <div className="aspect-video bg-muted animate-pulse" />
                        <div className="p-4 space-y-3">
                            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-full bg-muted animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                            <div className="flex items-center gap-2 pt-2">
                                <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                                <div className="h-3 w-20 bg-muted animate-pulse rounded" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
