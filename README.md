# Menu Mind

You're outside a restaurant. The menu is confusing. **Menu Mind** analyses the menu, learns your preferences, and recommends exactly one dish — plus real Google reviews to back it up.

## How it works

1. **Tell us about yourself** — allergies, dietary preferences, spice tolerance, vibe
2. **Snap the menu** — photo from your camera or upload from your phone
3. **Get your dish** — one recommendation, why it suits you, estimated nutrition, and relevant Google reviews

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Claude (`claude-sonnet-4-6`) for menu vision analysis and review filtering
- Google Places API (v1) for restaurant reviews
- Deployed on Vercel

## Local setup

```bash
cp example.env .env.local
# fill in your API keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `GOOGLE_PLACES_API_KEY` | Google Cloud Console → Places API (New) |
