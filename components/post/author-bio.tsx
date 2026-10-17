interface AuthorBioProps {
    name: string
    image: string | null
    postCount?: number
}

export function AuthorBio({ name, image }: AuthorBioProps) {
    return (
        <div className="py-8 border-t border-border">
            <div className="flex items-start gap-4 p-5 rounded-xl bg-muted/30 border border-border">
                {image ? (
                    <img src={image} alt={name} className="w-14 h-14 rounded-full ring-2 ring-border" />
                ) : (
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Written by</p>
                    <h4 className="text-lg font-semibold">{name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sharing thoughts, one post at a time.
                    </p>
                </div>
            </div>
        </div>
    )
}
