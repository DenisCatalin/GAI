import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const maxDuration = 60;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type OpenAIError = {
  message: string;
  status?: number;
};

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await openai.images.generate({
      model: "dall-e-2",
      prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (!response.data?.[0]?.url) {
      return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: response.data[0].url });
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    const typedError = error as OpenAIError;
    return NextResponse.json({ 
      error: "Error generating image", 
      details: typedError.message 
    }, { status: typedError.status || 500 });
  }
} 