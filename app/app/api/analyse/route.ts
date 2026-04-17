import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  const { image, preferences } = await req.json();

  // image is a data URL like "data:image/jpeg;base64,..."
  const base64 = image.split(",")[1];
  const mediaType = image.split(";")[0].split(":")[1] as "image/jpeg" | "image/png" | "image/webp";

  const prefSummary = [
    preferences.dietary && `Dietary: ${preferences.dietary}`,
    preferences.likes && `Loves: ${preferences.likes}`,
    preferences.dislikes && `Hates: ${preferences.dislikes}`,
    preferences.vibe && `Vibe: ${preferences.vibe}`,
  ]
    .filter(Boolean)
    .join(". ");

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: mediaType, data: base64 },
          },
          {
            type: "text",
            text: `This is a restaurant menu. ${prefSummary ? `The diner's preferences: ${prefSummary}.` : ""}

Recommend exactly ONE dish from the menu. Respond with valid JSON only, no markdown:
{
  "dish": "<dish name in English>",
  "description": "<plain English description of what it is, 1-2 sentences>",
  "why": "<one sentence on why it suits this person>"
}`,
          },
        ],
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to parse response", raw: text }, { status: 500 });
  }
}
