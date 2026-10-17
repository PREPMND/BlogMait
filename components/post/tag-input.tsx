"use client"

import { useState, KeyboardEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface TagInputProps {
    tags: string[]
    onChange: (tags: string[]) => void
    max?: number
}

export function TagInput({ tags, onChange, max = 5 }: TagInputProps) {
    const [input, setInput] = useState("")

    const addTag = (val: string) => {
        const tag = val.trim().toLowerCase()
        if (!tag || tags.includes(tag) || tags.length >= max) return
        onChange([...tags, tag])
        setInput("")
    }

    const removeTag = (idx: number) => {
        onChange(tags.filter((_, i) => i !== idx))
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault()
            addTag(input)
        }
        if (e.key === "Backspace" && !input && tags.length) {
            removeTag(tags.length - 1)
        }
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 border border-border rounded-lg bg-background min-h-[42px] items-center">
            {tags.map((tag, i) => (
                <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                    {tag}
                    <button type="button" onClick={() => removeTag(i)} className="hover:text-destructive">
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}
            {tags.length < max && (
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={() => addTag(input)}
                    placeholder={tags.length ? "" : "Add tags (press Enter)"}
                    className="flex-1 min-w-[120px] border-none shadow-none focus-visible:ring-0 p-0 h-7 text-sm"
                />
            )}
        </div>
    )
}
