import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();
const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

async function fetchGoogleReviews(restaurantName: string): Promise<{ text: string; rating: number }[]> {
  if (!PLACES_API_KEY || !restaurantName) return [];

  try {
    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "places.id,places.displayName",
        },
        body: JSON.stringify({ textQuery: restaurantName }),
      }
    );
    const searchData = await searchRes.json();
    const placeId = searchData.places?.[0]?.id;
    if (!placeId) return [];

    const detailRes = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": PLACES_API_KEY,
          "X-Goog-FieldMask": "reviews",
        },
      }
    );
    const detailData = await detailRes.json();
    return (detailData.reviews ?? []).map((r: { text?: { text?: string }; rating?: number }) => ({
      text: r.text?.text ?? "",
      rating: r.rating ?? 0,
    }));
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  const { image, preferences } = await req.json();

  // image is a data URL like "data:image/jpeg;base64,..."
  const base64 = image.split(",")[1];
  const mediaType = image.split(";")[0].split(":")[1] as "image/jpeg" | "image/png" | "image/webp";

  const prefSummary = [
    preferences.allergies && `Allergies: ${preferences.allergies}`,
    preferences.dietaryPref && `Dietary preference: ${preferences.dietaryPref}`,
    preferences.lowCal === "true" && "Prefers low-calorie options",
    preferences.likes && `Loves: ${preferences.likes}`,
    preferences.dislikes && `Hates: ${preferences.dislikes}`,
    preferences.spiceTolerance && preferences.spiceTolerance !== "any" && `Spice tolerance: ${preferences.spiceTolerance}`,
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

Recommend exactly ONE dish from the menu. Also extract the restaurant name if visible on the menu. Estimate the calorie count and macronutrient breakdown for the dish. Respond with valid JSON only, no markdown:
{
  "dish": "<dish name in English>",
  "restaurant": "<restaurant name if visible, otherwise empty string>",
  "description": "<plain English description of what it is, 1-2 sentences>",
  "why": "<one sentence on why it suits this person>",
  "nutrition": {
    "calories": "<estimated kcal, e.g. 450>",
    "protein": "<estimated grams, e.g. 25g>",
    "carbs": "<estimated grams, e.g. 40g>",
    "fat": "<estimated grams, e.g. 18g>",
    "fiber": "<estimated grams, e.g. 5g>"
  }
}`,
          },
        ],
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  try {
    const result = JSON.parse(text);

    // Fetch Google reviews for the restaurant
    const allReviews = await fetchGoogleReviews(result.restaurant || "");

    // Use Claude to pick the 3 most relevant reviews about the recommended dish
    let reviews: { text: string; rating: number }[] = [];
    if (allReviews.length > 0) {
      const filterMsg = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Here are Google reviews for a restaurant:\n${JSON.stringify(allReviews)}\n\nThe recommended dish is: "${result.dish}"\n\nPick up to 3 reviews that are most relevant to this specific dish (mention it, describe it, or clearly relate to it). If no reviews directly mention this dish, pick up to 3 reviews that mention similar dishes (e.g. same cuisine style, similar ingredients, or same category of food). Respond with valid JSON only, no markdown:\n[{"text": "<review text>", "rating": <number>}]`,
          },
        ],
      });
      const filterText = filterMsg.content[0].type === "text" ? filterMsg.content[0].text : "[]";
      try {
        reviews = JSON.parse(filterText);
      } catch {
        reviews = [];
      }
    }

    return NextResponse.json({ ...result, reviews });
  } catch {
    return NextResponse.json({ error: "Failed to parse response", raw: text }, { status: 500 });
  }
}
