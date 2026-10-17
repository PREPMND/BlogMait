"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { Button } from "@/components/ui/button"

interface MarkdownEditorProps {
    value: string
    onChange: (val: string) => void
}

const TOOLBAR = [
    { label: "B", prefix: "**", suffix: "**", title: "Bold" },
    { label: "I", prefix: "_", suffix: "_", title: "Italic" },
    { label: "H2", prefix: "\n## ", suffix: "", title: "Heading" },
    { label: "H3", prefix: "\n### ", suffix: "", title: "Subheading" },
    { label: "Link", prefix: "[", suffix: "](url)", title: "Link" },
    { label: "Code", prefix: "\n```\n", suffix: "\n```", title: "Code block" },
    { label: "Quote", prefix: "\n> ", suffix: "", title: "Blockquote" },
    { label: "List", prefix: "\n- ", suffix: "", title: "List item" },
    { label: "---", prefix: "\n---\n", suffix: "", title: "Divider" },
]

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const [tab, setTab] = useState<"write" | "preview">("write")

    const insertMarkdown = (prefix: string, suffix: string) => {
        const textarea = document.getElementById("md-editor") as HTMLTextAreaElement
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = value.substring(start, end)
        const replacement = prefix + (selected || "text") + suffix
        const newVal = value.substring(0, start) + replacement + value.substring(end)
        onChange(newVal)
        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = start + prefix.length
            textarea.selectionEnd = start + prefix.length + (selected || "text").length
        }, 0)
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden">
            <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2">
                <div className="flex gap-1">
                    {TOOLBAR.map((t) => (
                        <button
                            key={t.label}
                            type="button"
                            title={t.title}
                            onClick={() => insertMarkdown(t.prefix, t.suffix)}
                            className="px-2 py-1 text-xs font-mono rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant={tab === "write" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTab("write")}
                    >
                        Write
                    </Button>
                    <Button
                        type="button"
                        variant={tab === "preview" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setTab("preview")}
                    >
                        Preview
                    </Button>
                </div>
            </div>

            {tab === "write" ? (
                <textarea
                    id="md-editor"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Write your post in Markdown..."
                    className="w-full min-h-[400px] p-4 bg-background text-foreground font-mono text-sm resize-y focus:outline-none"
                    onKeyDown={(e) => {
                        if (e.key === "Tab") {
                            e.preventDefault()
                            const target = e.target as HTMLTextAreaElement
                            const start = target.selectionStart
                            const end = target.selectionEnd
                            onChange(value.substring(0, start) + "  " + value.substring(end))
                            setTimeout(() => {
                                target.selectionStart = target.selectionEnd = start + 2
                            }, 0)
                        }
                    }}
                />
            ) : (
                <div className="min-h-[400px] p-4 prose prose-neutral dark:prose-invert max-w-none">
                    {value ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                            {value}
                        </ReactMarkdown>
                    ) : (
                        <p className="text-muted-foreground italic">Nothing to preview yet...</p>
                    )}
                </div>
            )}

            <div className="border-t border-border px-3 py-1.5 flex justify-between text-xs text-muted-foreground">
                <span>{value.length} characters</span>
                <span>{Math.ceil(value.split(/\s+/).filter(Boolean).length / 200)} min read</span>
            </div>
        </div>
    )
}
