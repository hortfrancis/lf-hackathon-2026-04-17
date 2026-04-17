"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, Suspense } from "react";

function MenuCapture() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!preview) return;
    setLoading(true);

    const res = await fetch("/api/analyse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: preview,
        preferences: Object.fromEntries(searchParams.entries()),
      }),
    });

    const data = await res.json();
    const params = new URLSearchParams({ result: JSON.stringify(data) });
    router.push(`/result?${params}`);
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">Snap the menu</h1>
      <p className="text-gray-500 mb-8">Take a photo or upload an image of the menu.</p>

      <div
        onClick={() => inputRef.current?.click()}
        className="w-full h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors overflow-hidden"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Menu preview" className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">Tap to take photo or choose file</span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <button
        onClick={handleSubmit}
        disabled={!preview || loading}
        className="mt-6 w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition-colors disabled:opacity-40"
      >
        {loading ? "Thinking…" : "Find my dish →"}
      </button>
    </main>
  );
}

export default function MenuPage() {
  return (
    <Suspense>
      <MenuCapture />
    </Suspense>
  );
}
