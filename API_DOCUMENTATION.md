# Taichi Color Generator API Documentation

## Overview

The Taichi Color Generator API provides endpoints for generating, managing, and
exporting Taichi-inspired color themes. All endpoints are rate-limited to ensure
fair usage on Vercel's free tier.

**Base URL:** `https://your-domain.vercel.app/api`

## Rate Limits

All endpoints are rate-limited per IP address to ensure stability on Vercel's
free tier:

- **Generate Theme:** 10 requests/minute
- **Theme History:** 20 requests/minute
- **Export Theme:** 15 requests/minute

When rate limited, you'll receive a `429` status code with a `retryAfter` field
indicating seconds until reset.

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

---

## Endpoints

### 1. Generate Theme

Generate a Taichi-inspired color theme based on philosophical styles.

**Endpoint:** `POST /api/generate-theme`

**Rate Limit:** 10 requests/minute

#### Request Body

```json
{
  "style": "yin-yang" | "five-elements" | "bagua" | "random",
  "baseColor": "#FF5733",  // Optional: hex color
  "lockedColors": ["primary", "accent"]  // Optional: preserve specific colors
}
```

#### Parameters

| Parameter      | Type     | Required | Description                                                                                        |
| -------------- | -------- | -------- | -------------------------------------------------------------------------------------------------- |
| `style`        | string   | No       | Theme generation style. Options: `yin-yang`, `five-elements`, `bagua`, `random`. Default: `random` |
| `baseColor`    | string   | No       | Base color in hex format (e.g., `#FF5733`) to influence the palette                                |
| `lockedColors` | string[] | No       | Array of color token names to preserve from previous generation                                    |

#### Response

```json
{
    "success": true,
    "theme": {
        "primary": "hsl(210, 75%, 55%)",
        "secondary": "hsl(45, 80%, 60%)",
        "accent": "hsl(330, 70%, 50%)",
        "background": "hsl(0, 0%, 95%)",
        "surface": "hsl(0, 0%, 98%)",
        "text": "hsl(0, 0%, 15%)",
        "textSecondary": "hsl(0, 0%, 45%)",
        "border": "hsl(0, 0%, 85%)"
    },
    "metadata": {
        "style": "yin-yang",
        "timestamp": 1703376000000,
        "philosophy": "Balance of opposites - light and dark, active and passive, creating harmony through contrast."
    }
}
```

#### Error Response

```json
{
    "success": false,
    "error": "Invalid style. Must be one of: yin-yang, five-elements, bagua, random",
    "code": "INVALID_STYLE"
}
```

#### Style Descriptions

- **yin-yang:** Creates balanced themes with contrasting light and dark elements
- **five-elements:** Based on Wood, Fire, Earth, Metal, and Water - uses
  traditional element colors
- **bagua:** Uses the eight trigram directions for varied, harmonious palettes
- **random:** Completely random but harmonious color generation

#### Example Usage

```javascript
// Using fetch
const response = await fetch(
    "https://your-domain.vercel.app/api/generate-theme",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            style: "yin-yang",
            baseColor: "#3B82F6",
        }),
    },
);

const data = await response.json();
console.log(data.theme);
```

```bash
# Using curl
curl -X POST https://your-domain.vercel.app/api/generate-theme \
  -H "Content-Type: application/json" \
  -d '{
    "style": "five-elements",
    "baseColor": "#10B981"
  }'
```

---

### 2. Export Theme

Export a theme in various formats (CSS, SCSS, LESS, Tailwind, JSON).

**Endpoint:** `POST /api/export-theme`

**Rate Limit:** 15 requests/minute

#### Request Body

```json
{
    "theme": {
        "primary": "hsl(210, 75%, 55%)",
        "secondary": "hsl(45, 80%, 60%)",
        "accent": "hsl(330, 70%, 50%)",
        "background": "hsl(0, 0%, 95%)",
        "surface": "hsl(0, 0%, 98%)",
        "text": "hsl(0, 0%, 15%)",
        "textSecondary": "hsl(0, 0%, 45%)",
        "border": "hsl(0, 0%, 85%)"
    },
    "format": "css", // Options: css, scss, less, tailwind, json
    "options": {
        "prefix": "taichi", // Optional, default: "taichi"
        "includeComments": true // Optional, default: true
    }
}
```

#### Parameters

| Parameter                 | Type    | Required | Description                                                                       |
| ------------------------- | ------- | -------- | --------------------------------------------------------------------------------- |
| `theme`                   | object  | Yes      | Theme object with color tokens                                                    |
| `format`                  | string  | No       | Export format. Options: `css`, `scss`, `less`, `tailwind`, `json`. Default: `css` |
| `options.prefix`          | string  | No       | Variable prefix for CSS/SCSS/LESS. Default: `taichi`                              |
| `options.includeComments` | boolean | No       | Include helpful comments in output. Default: `true`                               |

#### Response

```json
{
    "success": true,
    "format": "css",
    "content": ":root {\n  --taichi-primary: hsl(210, 75%, 55%);\n  ...\n}",
    "filename": "taichi-theme.css"
}
```

#### Example Usage

```javascript
// Export as CSS
const response = await fetch(
    "https://your-domain.vercel.app/api/export-theme",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            theme: myTheme,
            format: "css",
            options: {
                prefix: "my-app",
                includeComments: true,
            },
        }),
    },
);

const { content, filename } = await response.json();

// Download the file
const blob = new Blob([content], { type: "text/css" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = filename;
a.click();
```

#### Format Examples

**CSS:**

```css
:root {
    --taichi-primary: hsl(210, 75%, 55%);
    --taichi-secondary: hsl(45, 80%, 60%);
    /* ... */
}
```

**SCSS:**

```scss
$taichi-primary: hsl(210, 75%, 55%);
$taichi-secondary: hsl(45, 80%, 60%);
// ...
```

**Tailwind:**

```javascript
module.exports = {
    theme: {
        extend: {
            colors: {
                taichi: {
                    "primary": "hsl(210, 75%, 55%)",
                    "secondary": "hsl(45, 80%, 60%)",
                    // ...
                },
            },
        },
    },
};
```

---

### 3. Theme History

Retrieve previously generated themes (placeholder for future implementation).

**Endpoint:** `GET /api/theme-history`

**Rate Limit:** 20 requests/minute

#### Query Parameters

| Parameter | Type   | Required | Description                                         |
| --------- | ------ | -------- | --------------------------------------------------- |
| `limit`   | number | No       | Number of themes to retrieve (max: 50). Default: 10 |
| `offset`  | number | No       | Pagination offset. Default: 0                       |

#### Response

```json
{
    "success": true,
    "themes": [],
    "pagination": {
        "limit": 10,
        "offset": 0,
        "total": 0
    },
    "message": "Theme history feature coming soon. Themes are currently stored locally in your browser."
}
```

#### Example Usage

```javascript
const response = await fetch(
    "https://your-domain.vercel.app/api/theme-history?limit=20&offset=0",
);
const data = await response.json();
```

---

## Error Codes

| Code                  | Description                                   |
| --------------------- | --------------------------------------------- |
| `METHOD_NOT_ALLOWED`  | Wrong HTTP method used                        |
| `RATE_LIMIT_EXCEEDED` | Too many requests, retry after specified time |
| `INVALID_STYLE`       | Invalid theme generation style                |
| `INVALID_BASE_COLOR`  | Invalid hex color format                      |
| `INVALID_THEME`       | Invalid theme object structure                |
| `INVALID_FORMAT`      | Invalid export format                         |
| `INTERNAL_ERROR`      | Server error occurred                         |

---

## LLM Integration Guide

These APIs are designed to be LLM-friendly with clear, structured responses and
comprehensive documentation.

### Example LLM Prompt

```
Generate a Taichi-inspired color theme using the five-elements style with a blue base color.
Then export it as a Tailwind configuration.
```

### Example LLM Implementation

```javascript
// Step 1: Generate theme
const generateResponse = await fetch(
    "https://your-domain.vercel.app/api/generate-theme",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            style: "five-elements",
            baseColor: "#3B82F6",
        }),
    },
);

const { theme, metadata } = await generateResponse.json();

// Step 2: Export as Tailwind
const exportResponse = await fetch(
    "https://your-domain.vercel.app/api/export-theme",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            theme,
            format: "tailwind",
        }),
    },
);

const { content } = await exportResponse.json();
console.log(content);
```

---

## CORS

All endpoints support CORS and can be called from any origin. Preflight
`OPTIONS` requests are handled automatically.

---

## Best Practices

1. **Respect Rate Limits:** Implement exponential backoff when receiving 429
   responses
2. **Cache Responses:** Cache theme generations client-side to reduce API calls
3. **Handle Errors:** Always check the `success` field and handle error codes
   appropriately
4. **Use Appropriate Formats:** Choose the export format that matches your tech
   stack
5. **Provide Feedback:** Use the `philosophy` field from metadata to explain
   themes to users

---

## Support

For issues or questions, please open an issue on the GitHub repository.
