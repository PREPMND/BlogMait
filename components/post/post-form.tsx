"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CldUploadWidget } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type PostFormValues = {
    title: string;
    description: string;
    slug: string;
    isDraft: boolean;
    isPublished: boolean
};

export function PostForm() {
    const [thumbnail, setThumbnail] = useState("");
    const [imageSource, setImageSource] = useState<"" | "upload" | "ai">("");
    const [uploading, setUploading] = useState(false);
    const [isDraft, setIsDraft] = useState(true);
    const [isPublished, setIsPublished] = useState(false);
    const form = useForm<PostFormValues>({
        defaultValues: {
            title: "",
            description: "",
            slug: "",
        },
    });

    const onSubmit = async (data: PostFormValues) => {
        await fetch("/api/post", {
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
    };

    return (
        <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    placeholder="Enter post title"
                    {...form.register("title")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    rows={6}
                    placeholder="Write a short description..."
                    {...form.register("description")}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                    id="slug"
                    placeholder="my-awesome-blog"
                    {...form.register("slug")}
                />
            </div>

            <div className="space-y-3">
                <Label>Thumbnail</Label>

                <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!}
                    onSuccess={(result: any) => {
                        setThumbnail(result.info.secure_url);
                        setImageSource("upload");
                        setUploading(false);
                    }}
                    onError={() => {
                        setUploading(false);
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
                    <span className="text-xs text-muted-foreground">OR</span>
                    <div className="h-px flex-1 bg-border" />
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    disabled
                >
                    ✨ Generate with AI
                </Button>
            </div>
            {thumbnail && (
                <div className="space-y-2">
                    <Label>Thumbnail Preview</Label>

                    <img
                        src={thumbnail}
                        alt="Thumbnail Preview"
                        className="h-56 w-full rounded-xl border object-cover"
                    />

                    <p className="text-xs text-muted-foreground">
                        Source: {imageSource}
                    </p>
                </div>
            )}

            <div className="space-y-3">
                <Label>Status</Label>

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                    >
                        Save as Draft
                    </Button>

                    <Button
                        type="button"
                    >
                        Publish
                    </Button>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full"
            >
                Create Post
            </Button>
        </form>
    );
}