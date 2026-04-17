"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PreferencesPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    dietary: "",
    likes: "",
    dislikes: "",
    vibe: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(prefs);
    router.push(`/menu?${params}`);
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">MenuMind</h1>
      <p className="text-gray-500 mb-8">Tell us about yourself, then snap the menu.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Dietary requirements</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. vegetarian, gluten-free"
            value={prefs.dietary}
            onChange={(e) => setPrefs({ ...prefs, dietary: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Things you love</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. spicy food, seafood, rich sauces"
            value={prefs.likes}
            onChange={(e) => setPrefs({ ...prefs, likes: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Things you hate</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. coriander, liver"
            value={prefs.dislikes}
            onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Vibe</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. light lunch, full blowout, sharing"
            value={prefs.vibe}
            onChange={(e) => setPrefs({ ...prefs, vibe: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white rounded-lg py-3 font-medium hover:bg-gray-800 transition-colors"
        >
          Next: Snap the menu →
        </button>
      </form>
    </main>
  );
}
