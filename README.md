# Aura AI: a beauty-advisor concept for Nykaa

A working prototype by Alisha Chaudhari of a new Nykaa feature: **Aura**, a personal AI beauty advisor that builds a routine, checks it for safety and keeps it stocked.

## What's inside
- **AI skin consultation:** upload a selfie, and Aura reads skin type, undertone and shade, then suggests matching products. It uses Gemini 2.5 Flash through a Supabase edge function.
- **Smart intent bar:** tell Aura your goal and get a routine built for it.
- **Ingredient safety layer:** flags clashes between products in a routine (for example, when to use Vitamin C) and explains *why* each product is recommended.
- **Virtual mirror** for trying shades.
- **Autonomous replenishment:** a routine dashboard that tracks how much product is left and offers a one-tap reorder with auto-refill.
- **Category browser** with Nykaa-style product cards.

A concept prototype on mock product data. It is not affiliated with or endorsed by Nykaa.

**Stack:** React + Vite + TypeScript, Tailwind + shadcn/ui, Zustand, Supabase edge functions. Built with Lovable.

```bash
npm install
npm run dev
```
