# Project Skills + Tech Inventory (Alex Jextures)

This document summarizes the skills, tools, and patterns used in this project so a future AI agent can continue development consistently.

## Stack
- React 18 (functional components, hooks)
- Vite (dev/build tooling)
- GSAP 3 + ScrollTrigger (scroll-driven animation)
- three.js + @react-three/fiber + @react-three/drei (3D scene for sports section)
- Iconify (@iconify/react + line-md icon set)
- Custom CSS (primary styling), Tailwind config present but mostly hand‑written CSS
- Media: local images + local MP4 video (no external CDN assets)

## Core Frontend Skills
- Scroll-driven storytelling with GSAP timelines (pin/scrub, stagger, matchMedia)
- Responsive animation tuning (separate desktop vs mobile timelines)
- Canvas effects (particles, wavefield)
- SVG manipulation (inline SVGs, custom icons, transforms)
- 3D scene setup (lights, textures from CanvasTexture, simple materials)
- Lightbox/gallery interactions (open/close, keyboard ESC, focus/scroll lock)
- Performance considerations for mobile (reduce layout thrash, optimize easing)
- Internationalization toggle (CN/EN) with smooth UI switch

## Visual/UX Principles (Project-Specific)
- Premium dark theme with orange/gold accents
- Expressive typography (Exo for English display/body; Noto Serif SC for Chinese)
- Cinematic motion, smooth easing, no harsh snaps
- Strong visual hierarchy, generous spacing, but mobile tightened
- No emojis for icons; use icon system or custom SVGs
- Avoid external CDNs and iframes for content assets

## Key Components & Patterns
- `IntroReveal`: hero animation + canvas particles
- `SportScene`: 3D court scene with R3F, custom textures
- `TravelSection`: scroll‑scale video reveal + mobile gallery
- `CareerTimeline`: scroll line + light‑up nodes
- `ReferralSection`: typewriter reveal + signal cards
- `FengShuiSection`: wavefield canvas background + reveal cards
- `SloganSection`: character‑based reveal + animated divider
- `ClosingSection`: CTA + stagger reveal + footer

## Content/Data Conventions
- Primary content in `content.json`
- bilingual strings: `{ en: "...", cn: "..." }`
- Icons referenced by short codes (e.g. `BL`, `FL`, `PX`, `MOB`, `DOWN`, `QN`)
- Media stored in `public/` or `public/travel/`

## Agent Instructions (for next AI)
- Keep all assets local. No CDN or CodePen embeds.
- Match existing animation tone (cinematic, smooth, premium).
- Respect bilingual copy and line breaks.
- Follow existing CSS variable palette.
- Avoid emojis in UI; use icon system or custom SVGs.
- Mobile polish is a priority; test/tune mobile scroll behavior.

