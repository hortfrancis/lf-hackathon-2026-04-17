"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface AnalysisResult {
  dish: string;
  description: string;
  why: string;
  reviews: { text: string; rating: number }[];
}

function ResultCard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  let result: AnalysisResult | null = null;
  try {
    result = JSON.parse(searchParams.get("result") ?? "");
  } catch {
    // invalid state — handled below
  }

  if (!result) {
    return (
      <main className="max-w-md mx-auto px-6 py-12 text-center">
        <p className="text-gray-500">Something went wrong. <button onClick={() => router.push("/")} className="underline">Start over</button></p>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Your dish</p>
      <h1 className="text-3xl font-bold mb-3">{result.dish}</h1>
      <p className="text-gray-700 mb-2">{result.description}</p>
      <p className="text-sm text-gray-500 italic mb-8">{result.why}</p>

      {result.reviews?.length > 0 && (
        <div>
          <h2 className="font-semibold mb-3">What people say</h2>
          <ul className="space-y-3">
            {result.reviews.map((r, i) => (
              <li key={i} className="bg-white border rounded-lg px-4 py-3 text-sm">
                <span className="text-yellow-500">{"★".repeat(r.rating)}</span>
                <p className="mt-1 text-gray-600">{r.text}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => router.push("/")}
        className="mt-10 w-full border border-gray-300 rounded-lg py-3 text-sm hover:bg-gray-100 transition-colors"
      >
        Start over
      </button>
    </main>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultCard />
    </Suspense>
  );
}
