"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PreferencesPage() {
  const router = useRouter();
  const [prefs, setPrefs] = useState({
    allergies: "",
    dietaryPref: "",
    lowCal: false,
    likes: "",
    dislikes: "",
    spiceTolerance: "any",
    vibe: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams({
      allergies: prefs.allergies,
      dietaryPref: prefs.dietaryPref,
      lowCal: String(prefs.lowCal),
      likes: prefs.likes,
      dislikes: prefs.dislikes,
      spiceTolerance: prefs.spiceTolerance,
      vibe: prefs.vibe,
    });
    router.push(`/menu?${params}`);
  };

  return (
    <main className="max-w-md mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-2">MenuMind</h1>
      <p className="text-gray-500 mb-8">Tell us about yourself, then snap the menu.</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Allergies</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. nuts, shellfish, dairy"
            value={prefs.allergies}
            onChange={(e) => setPrefs({ ...prefs, allergies: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dietary preference</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. vegetarian, vegan, halal, gluten-free"
            value={prefs.dietaryPref}
            onChange={(e) => setPrefs({ ...prefs, dietaryPref: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="lowCal"
            className="h-4 w-4 rounded border-gray-300"
            checked={prefs.lowCal}
            onChange={(e) => setPrefs({ ...prefs, lowCal: e.target.checked })}
          />
          <label htmlFor="lowCal" className="text-sm font-medium">Prefer low-calorie options</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Things you love</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. seafood, rich sauces, cheese"
            value={prefs.likes}
            onChange={(e) => setPrefs({ ...prefs, likes: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Things you dislike</label>
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. coriander, liver, olives"
            value={prefs.dislikes}
            onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Spice tolerance</label>
          <select
            className="w-full border rounded-lg px-3 py-2 text-sm"
            value={prefs.spiceTolerance}
            onChange={(e) => setPrefs({ ...prefs, spiceTolerance: e.target.value })}
          >
            <option value="any">Any — no preference</option>
            <option value="none">None — keep it mild</option>
            <option value="low">Low — a little kick</option>
            <option value="medium">Medium</option>
            <option value="high">High — bring the heat</option>
            <option value="max">Max — the spicier the better</option>
          </select>
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
