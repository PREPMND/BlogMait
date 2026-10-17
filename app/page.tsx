import Perfect3DTiltCard from "@/components/ui/card-tactical"
import { db } from "@/lib/db"
import { posts, postTags, tags } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import Link from "next/link"

export default async function Home() {
    const allPosts = await db.query.posts.findMany({
        where: eq(posts.isPublished, true),
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        with: {
            author: { columns: { name: true, image: true } },
            tags: { with: { tag: true } },
        },
    })

    const allTags = await db.query.tags.findMany({
        orderBy: (tags, { asc }) => [asc(tags.name)],
    })

    return (
        <div className="py-6 px-4">
            {allTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 justify-center">
                    {allTags.map(tag => (
                        <Link
                            key={tag.id}
                            href={`/search?tag=${tag.slug}`}
                            className="px-3 py-1 rounded-full text-xs font-medium border border-border hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                            {tag.name}
                        </Link>
                    ))}
                </div>
            )}

            {allPosts.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                    <p className="text-lg">No posts yet</p>
                    <p className="text-sm mt-2">Be the first to write something.</p>
                </div>
            ) : (
                <div className="grid xs:grid-cols-2 lg:grid-cols-3 mb-10 mt-4 place-items-evenly gap-10 md:gap-12 lg:gap-10">
                    {allPosts.map((post) => (
                        <Perfect3DTiltCard
                            key={post.id}
                            id={post.id}
                            slug={post.slug}
                            title={post.title}
                            description={post.description}
                            thumbnail={post.thumbnail}
                            image={post.author.image}
                            username={post.author.name}
                            href={`/post/${post.slug}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
