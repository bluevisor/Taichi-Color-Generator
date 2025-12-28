# API Directory

This directory contains Vercel serverless functions for the Taichi Theme
Generator.

## Structure

```
api/
├── generate-theme.ts    # Self-contained theme generator
├── export-theme.ts      # Multi-format theme exporter
└── README.md            # This file
```

## Key Features

- **HSL Color Engine:** Fast, self-contained color harmony generation.
- **Dual Support:** Every generation returns matching Light and Dark themes.
- **Semantic Tokens:** Outputs 20 semantic tokens (bg, card, status, branding,
  etc.).
- **Format Support:** Export to CSS, SCSS, LESS, Tailwind, and JSON.

## Rate Limiting

- **Generate Theme:** 10 requests/minute per IP
- **Export Theme:** 15 requests/minute per IP

## Testing Endpoints Locally

Start the Vercel dev server:

```bash
vercel dev
```

### Example: Generate dual-themes

```bash
curl -X POST http://localhost:3000/api/generate-theme \
  -H "Content-Type: application/json" \
  -d '{
    "style": "analogous", 
    "baseColor": "#3B82F6",
    "saturation": 2,
    "contrast": 1
  }'
```

### Example: Export to CSS

```bash
curl -X POST http://localhost:3000/api/export-theme \
  -H "Content-Type: application/json" \
  -d '{
    "theme": { "primary": "#3B82F6", "bg": "#F8FAFC" },
    "format": "css",
    "options": { "prefix": "my-app" }
  }'
```

## Documentation

For the full API reference, request/response schemas, and LLM integration guide,
see [API_DOCUMENTATION.md](../API_DOCUMENTATION.md).
