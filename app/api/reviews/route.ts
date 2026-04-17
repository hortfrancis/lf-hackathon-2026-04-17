import { NextRequest, NextResponse } from "next/server";

const PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) return NextResponse.json({ error: "query required" }, { status: 400 });
  if (!PLACES_API_KEY) return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY not set" }, { status: 500 });

  // Step 1: find the place
  const searchRes = await fetch(
    `https://places.googleapis.com/v1/places:searchText`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": PLACES_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName",
      },
      body: JSON.stringify({ textQuery: query }),
    }
  );

  const searchData = await searchRes.json();
  const placeId = searchData.places?.[0]?.id;
  if (!placeId) return NextResponse.json({ reviews: [] });

  // Step 2: get reviews
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
  const reviews = (detailData.reviews ?? []).slice(0, 5).map((r: { text?: { text?: string }; rating?: number }) => ({
    text: r.text?.text ?? "",
    rating: r.rating ?? 0,
  }));

  return NextResponse.json({ reviews });
}
