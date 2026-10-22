"use client"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"

interface PostContentProps {
    content: string
}

export function PostContent({ content }: PostContentProps) {
    if (!content) {
        return <p className="text-muted-foreground italic py-8">No content yet.</p>
    }

    return (
        <div className="prose prose-neutral dark:prose-invert max-w-none
            prose-headings:font-semibold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-7 prose-p:mb-4
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:text-sm prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg prose-pre:overflow-x-auto
            prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
            prose-img:rounded-lg
            prose-li:leading-7
            prose-table:text-sm prose-table:overflow-x-auto prose-table:block
            prose-th:text-left prose-th:font-semibold
        ">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeSlug, [rehypeAutolinkHeadings, { behavior: "wrap" }]]}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
}
