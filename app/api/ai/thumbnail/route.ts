import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { InferenceClient } from "@huggingface/inference";

const gemini = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

const hf = new InferenceClient(process.env.HF_TOKEN!);

export async function POST(req: NextRequest) {
    try {
        const { title, description } = await req.json();

        const response = await gemini.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
Generate one detailed thumbnail prompt.

Title:
${title}

Description:
${description}

Requirements:
- Cinematic
- Professional
- High quality
- Digital illustration
- No text
- Return ONLY the prompt.
`,
        });

        const prompt = response.text ?? "";

        const image = await hf.textToImage({
            provider: "hf-inference",
            model: "black-forest-labs/FLUX.1-dev",
            inputs: prompt,
        });

        return new NextResponse(image, {
            headers: {
                "Content-Type": "image/png",
            },
        });

    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Failed to generate image." },
            { status: 500 }
        );
    }
}