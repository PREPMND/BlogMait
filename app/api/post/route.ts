import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";


export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        });

        if (!session) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const {
            title,
            description,
            slug,
            thumbnail,
            imageSource,
            isDraft,
            isPublished,
        } = body;
        if (!title || !description || !slug) {
            return NextResponse.json(
                {
                    message: "Please fill all required fields.",
                },
                {
                    status: 400,
                }
            );
        } //ok
        let finalThumbnail = thumbnail;

        if (
            typeof thumbnail === "string" &&
            thumbnail.startsWith("data:image")
        ) {
            const uploadResult = await cloudinary.uploader.upload(thumbnail, {
                folder: "blog-thumbnails",
            });

            finalThumbnail = uploadResult.secure_url;
        }


        const existingPost = await db.query.posts.findFirst({
            where: (posts, { eq }) => eq(posts.slug, slug),
        });

        if (existingPost) {
            return NextResponse.json(
                {
                    message: "Slug already exists.",
                },
                {
                    status: 409,
                }
            );
        }



        const createdPost = await db
            .insert(posts)
            .values({
                title,
                description,
                slug,
                thumbnail: finalThumbnail,
                imageSource: imageSource ?? "ai",
                isDraft,
                isPublished,
                authorId: session.user.id,
            })
            .returning();

        return NextResponse.json(
            {
                message: "Post created successfully.",
                post: createdPost[0],
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Internal Server Error",
            },
            {
                status: 500,
            }
        );
    }
}