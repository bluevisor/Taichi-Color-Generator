# API Development Summary

**Last Updated:** December 28, 2025

## Overview

The Taichi Theme Generator API provides programmatic access to balanced color
theme generation. All endpoints are self-contained serverless functions
optimized for Vercel's free tier with robust rate limiting.

## Key Features

### 1. Dual-Theme Response

Every request to `/api/generate-theme` returns both **Light and Dark themes**
simultaneously, ensuring visual parity for modern UI development.

### 2. Advanced Generation Parameters

- **Saturation (-5 to 5):** Control vibrancy from grayscale to vivid.
- **Contrast (-5 to 5):** Fine-tune readability and depth.
- **Brightness (-5 to 5):** Global lightness shift for the foundation.

### 3. Harmony Modes

9 color harmony styles supported:

- `monochrome`, `analogous`, `complementary`, `split-complementary`,
- `triadic`, `tetradic`, `compound`, `triadic-split`, `random`

## Available Endpoints

### `/api/generate-theme` (POST)

- Generates balanced Light and Dark themes using color harmony theory.
- Returns 20 semantic tokens per theme (bg, card, primary, status colors, etc.).
- Includes metadata with philosophical context.

### `/api/export-theme` (POST)

- Converts any theme object into developer formats.
- Supports: **CSS, SCSS, LESS, Tailwind, and JSON**.

## File Structure

```
api/
├── generate-theme.ts   # Self-contained theme generator
├── export-theme.ts     # Multi-format exporter
└── README.md           # Local dev guide
```

## Testing

```bash
curl -X POST https://taichi.bucaastudio.com/api/generate-theme \
  -H "Content-Type: application/json" \
  -d '{"style":"analogous","baseColor":"#3B82F6","saturation":2}'
```

## Future Roadmap

1. **OKLCH Export:** Support `oklch()` CSS values for P3 wide gamut displays.
2. **AI Integration:** Allow LLMs to refine generated themes via API.

---

**Status:** ✅ Live and Functional
