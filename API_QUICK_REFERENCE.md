# API Quick Reference

## Endpoints

### 1. Generate Theme

```
POST /api/generate-theme
```

**Request:**

```json
{
    "style": "yin-yang",
    "baseColor": "#3B82F6",
    "lockedColors": ["primary"]
}
```

**Response:**

```json
{
    "success": true,
    "theme": {/* 8 color tokens */},
    "metadata": {
        "style": "yin-yang",
        "timestamp": 1703376000000,
        "philosophy": "Balance of opposites..."
    }
}
```

**Rate Limit:** 10 requests/minute

---

### 2. Export Theme

```
POST /api/export-theme
```

**Request:**

```json
{
    "theme": {/* theme object */},
    "format": "css",
    "options": {
        "prefix": "taichi",
        "includeComments": true
    }
}
```

**Response:**

```json
{
    "success": true,
    "format": "css",
    "content": ":root { ... }",
    "filename": "taichi-theme.css"
}
```

**Rate Limit:** 15 requests/minute

---

### 3. Theme History

```
GET /api/theme-history?limit=10&offset=0
```

**Response:**

```json
{
    "success": true,
    "themes": [],
    "pagination": { "limit": 10, "offset": 0, "total": 0 },
    "message": "Coming soon..."
}
```

**Rate Limit:** 20 requests/minute

---

## Styles

- `yin-yang` - Balanced light/dark contrast
- `five-elements` - Wood, Fire, Earth, Metal, Water
- `bagua` - Eight trigram directions
- `random` - Harmonious random colors

---

## Export Formats

- `css` - CSS custom properties
- `scss` - SCSS variables
- `less` - LESS variables
- `tailwind` - Tailwind config
- `json` - Raw JSON

---

## Error Codes

| Code                  | Meaning                 |
| --------------------- | ----------------------- |
| `METHOD_NOT_ALLOWED`  | Wrong HTTP method       |
| `RATE_LIMIT_EXCEEDED` | Too many requests       |
| `INVALID_STYLE`       | Invalid style parameter |
| `INVALID_BASE_COLOR`  | Invalid hex color       |
| `INVALID_THEME`       | Invalid theme object    |
| `INVALID_FORMAT`      | Invalid export format   |
| `INTERNAL_ERROR`      | Server error            |

---

## Rate Limit Headers

```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1703376060000
```

---

## CORS

All endpoints support CORS from any origin.

---

## Quick Start

```javascript
// Generate a theme
const response = await fetch("/api/generate-theme", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ style: "yin-yang" }),
});
const { theme } = await response.json();

// Export as CSS
const exportResponse = await fetch("/api/export-theme", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme, format: "css" }),
});
const { content, filename } = await exportResponse.json();

// Download file
const blob = new Blob([content], { type: "text/css" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = filename;
a.click();
```

---

For complete documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
