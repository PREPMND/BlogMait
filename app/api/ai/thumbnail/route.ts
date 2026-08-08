import { NextRequest, NextResponse } from "next/server";

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

        const response = await fetch(
            "https://router.huggingface.co/nscale/v1/images/generations",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: "black-forest-labs/FLUX.1-schnell",
                    prompt,
                    response_format: "b64_json",
                }),
            }
        );

        if (!response.ok) {
            const err = await response.text();

            return NextResponse.json(
                {
                    message: err,
                },
                {
                    status: response.status,
                }
            );
        }

        const result = await response.json();

        const image = `data:image/png;base64,${result.data[0].b64_json}`;

        return NextResponse.json({
            image,
            prompt,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Failed to generate image.",
            },
            {
                status: 500,
            }
        );
    }
}