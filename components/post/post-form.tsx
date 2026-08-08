"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PostFormValues = {
    title: string;
    description: string;
    slug: string;
};

export function PostForm() {
    const router = useRouter();

    const [thumbnail, setThumbnail] = useState("");
    const [imageSource, setImageSource] = useState<
        "" | "upload" | "ai"
    >("");

    const [uploading, setUploading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [creating, setCreating] = useState(false);

    const [isDraft, setIsDraft] = useState(true);
    const [isPublished, setIsPublished] = useState(false);

    const [error, setError] = useState("");

    const form = useForm<PostFormValues>({
        defaultValues: {
            title: "",
            description: "",
            slug: "",
        },
    });

    const generateAIThumbnail = async () => {
        setError("");

        const title = form.getValues("title").trim();
        const description = form.getValues("description").trim();

        if (!title || !description) {
            toast.error("Enter title and description first.");
            setError("Enter title and description first.");
            return;
        }

        try {
            setAiLoading(true);

            const res = await fetch("/api/ai/thumbnail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message ??
                    "Failed to generate thumbnail."
                );
            }

            setThumbnail(data.image);
            setImageSource("ai");

            toast.success("AI thumbnail generated.");
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to generate thumbnail.";

            setError(message);
            toast.error(message);
        } finally {
            setAiLoading(false);
        }
    };
    const onSubmit = async (data: PostFormValues) => {
        setError("");

        if (!thumbnail) {
            toast.error("Please upload or generate a thumbnail.");
            return;
        }

        try {
            setCreating(true);

            const res = await fetch("/api/post", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    thumbnail,
                    imageSource,
                    isDraft,
                    isPublished,
                }),
            });

            const body = await res.json();

            if (!res.ok) {
                throw new Error(
                    body.message ?? "Failed to create post."
                );
            }

            toast.success("Post created successfully.");

            form.reset();

            setThumbnail("");
            setImageSource("");
            setIsDraft(true);
            setIsPublished(false);

            router.push(`/`);
            router.refresh();
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Failed to create post.";

            setError(message);
            toast.error(message);
        } finally {
            setCreating(false);
        }
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-2">
                <Label htmlFor="title">
                    Title
                </Label>

                <Input
                    id="title"
                    placeholder="Enter post title"
                    {...form.register("title", {
                        required: true,
                    })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">
                    Description
                </Label>

                <Textarea
                    id="description"
                    rows={6}
                    placeholder="Write a short description..."
                    {...form.register("description", {
                        required: true,
                    })}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">
                    Slug
                </Label>

                <Input
                    id="slug"
                    placeholder="my-awesome-blog"
                    {...form.register("slug", {
                        required: true,
                    })}
                />
            </div>

            <div className="space-y-3">
                <Label>
                    Thumbnail
                </Label>

                <CldUploadWidget
                    uploadPreset={
                        process.env
                            .NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!
                    }
                    onSuccess={(result: any) => {
                        setThumbnail(result.info.secure_url);
                        setImageSource("upload");
                        setUploading(false);

                        toast.success(
                            "Thumbnail uploaded."
                        );
                    }}
                    onError={() => {
                        setUploading(false);

                        toast.error(
                            "Upload failed."
                        );
                    }}
                >
                    {({ open }) => (
                        <Button
                            type="button"
                            variant="outline"
                            disabled={uploading}
                            onClick={() => {
                                setUploading(true);
                                open();
                            }}
                        >
                            {uploading
                                ? "Uploading..."
                                : "Upload Thumbnail"}
                        </Button>
                    )}
                </CldUploadWidget>

                <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs text-muted-foreground">
                        OR
                    </span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    disabled={aiLoading}
                    onClick={generateAIThumbnail}
                >
                    {aiLoading
                        ? "Generating..."
                        : "✨ Generate with AI"}
                </Button>
            </div>

            {thumbnail && (
                <div className="space-y-2">
                    <Label>
                        Thumbnail Preview
                    </Label>

                    <img
                        src={thumbnail}
                        alt="Thumbnail"
                        className="h-56 w-full rounded-xl border object-cover"
                    />

                    <p className="text-xs text-muted-foreground">
                        Source: {imageSource}
                    </p>
                </div>
            )}

            <div className="space-y-3">
                <Label>
                    Status
                </Label>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant={
                            isDraft
                                ? "default"
                                : "outline"
                        }
                        onClick={() => {
                            setIsDraft(true);
                            setIsPublished(false);
                        }}
                    >
                        Save as Draft
                    </Button>

                    <Button
                        type="button"
                        variant={
                            isPublished
                                ? "default"
                                : "outline"
                        }
                        onClick={() => {
                            setIsDraft(false);
                            setIsPublished(true);
                        }}
                    >
                        Publish
                    </Button>
                </div>
            </div>

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={creating}
            >
                {creating
                    ? "Creating Post..."
                    : "Create Post"}
            </Button>
        </form>
    );


}