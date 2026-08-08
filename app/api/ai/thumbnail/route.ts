import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();

    const prompt = `
Cinematic blog thumbnail.

Title: ${title}
Description: ${description}

Modern digital illustration,
professional composition,
highly detailed,
beautiful lighting,
vibrant colors,
8k quality,
masterpiece,
no text.
`.trim();

    const result = await fal.subscribe("fal-ai/flux/dev", {
      input: {
        prompt,
      },
    });

    const image = result.data?.images?.[0]?.url;

    if (!image) {
      return NextResponse.json(
        { message: "No image returned from FAL." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      image,
      prompt,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to generate image.",
      },
      {
        status: 500,
      }
    );
  }
}