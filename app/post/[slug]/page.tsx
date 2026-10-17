import { db } from "@/lib/db"
import { posts } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { PostContent } from "@/components/post/post-content"
import { ViewTracker } from "@/components/post/view-tracker"
import { Reactions } from "@/components/post/reactions"
import { RelatedPosts } from "@/components/post/related-posts"
import { ReadingProgress } from "@/components/post/reading-progress"
import { ShareButtons } from "@/components/post/share-buttons"
import { AuthorBio } from "@/components/post/author-bio"
import { SeriesNav } from "@/components/post/series-nav"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await db.query.posts.findFirst({ where: eq(posts.slug, slug) })
    if (!post) return { title: "Not Found" }
    return { title: post.title, description: post.description }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params

    const post = await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
        with: {
            author: { columns: { name: true, image: true, id: true } },
            tags: { with: { tag: true } },
        },
    })

    if (!post) notFound()

    const tagList = post.tags?.map((pt: any) => pt.tag) ?? []
    const tagSlugs = tagList.map((t: any) => t.slug)

    return (
        <>
            <ReadingProgress />
            <div className="max-w-3xl mx-auto px-4 py-10">
                <ViewTracker slug={slug} />

                <article>
                    <header className="mb-8">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {tagList.map((tag: any) => (
                                <a
                                    key={tag.id}
                                    href={`/search?tag=${tag.slug}`}
                                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                >
                                    {tag.name}
                                </a>
                            ))}
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
                            {post.title}
                        </h1>

                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            {post.description}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
                            <div className="flex items-center gap-3 min-w-0">
                                {post.author.image && (
                                    <img src={post.author.image} alt={post.author.name} className="w-10 h-10 rounded-full shrink-0" />
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{post.author.name}</p>
                                    <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground flex-wrap">
                                        <time>{new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
                                        <span>·</span>
                                        <span>{post.readingTime || 1} min</span>
                                        <span>·</span>
                                        <span>{post.views ?? 0} views</span>
                                    </div>
                                </div>
                            </div>
                            <ShareButtons title={post.title} slug={post.slug} />
                        </div>

                        {post.thumbnail && (
                            <div className="mt-6 overflow-hidden rounded-xl">
                                <img src={post.thumbnail} alt={post.title} className="w-full aspect-video object-cover" />
                            </div>
                        )}
                    </header>

                    <PostContent content={post.content || ""} />
                </article>

                <Reactions slug={slug} />

                <SeriesNav slug={slug} />

                <AuthorBio name={post.author.name} image={post.author.image} />

                <RelatedPosts slug={slug} tags={tagSlugs} />
            </div>
        </>
    )
}
