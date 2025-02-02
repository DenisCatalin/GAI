import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(request: Request) {
  const body = await request.json();
  const { topic } = body;
  
  if (!topic) {
    return NextResponse.json({ message: "Topic is required" }, { status: 400 });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: `You are an AI that suggests multimedia project ideas based on a given topic.` },
        { role: "user", content: `Give me 3 multimedia project ideas for the topic: ${topic}` }
      ],
    //   max_tokens: 200,
    });

    const ideas = response.choices[0]?.message?.content?.split("\n").filter(idea => idea.trim() !== '') || [];
    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}