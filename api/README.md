# API Directory

This directory contains Vercel serverless functions for the Taichi Color
Generator.

## Structure

```
api/
├── generate-theme.ts    # Main theme generation endpoint
├── export-theme.ts      # Theme export in multiple formats
├── theme-history.ts     # Theme history (placeholder)
└── utils/
    └── rate-limit.ts    # Rate limiting utility
```

## Rate Limiting

All endpoints are rate-limited to ensure stability on Vercel's free tier:

- **Generate Theme:** 10 requests/minute per IP
- **Export Theme:** 15 requests/minute per IP
- **Theme History:** 20 requests/minute per IP

The rate limiting is implemented using an in-memory store that resets on cold
starts, which is acceptable for basic protection.

## Development

### Local Testing

To test the API endpoints locally, you can use Vercel CLI:

```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Run the development server
vercel dev
```

This will start a local server that mimics the Vercel environment.

### Testing Endpoints

```bash
# Test generate-theme endpoint
curl -X POST http://localhost:3000/api/generate-theme \
  -H "Content-Type: application/json" \
  -d '{"style": "yin-yang", "baseColor": "#3B82F6"}'

# Test export-theme endpoint
curl -X POST http://localhost:3000/api/export-theme \
  -H "Content-Type: application/json" \
  -d '{
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
    "format": "css"
  }'

# Test theme-history endpoint
curl http://localhost:3000/api/theme-history?limit=10
```

## Deployment

These functions are automatically deployed when you push to Vercel. No
additional configuration is needed.

## Future Enhancements

1. **Database Integration:** Add persistent storage for theme history using
   Vercel KV or PostgreSQL
2. **User Authentication:** Implement user accounts and API keys
3. **Advanced Rate Limiting:** Use Vercel KV for distributed rate limiting
   across edge functions
4. **Analytics:** Track popular styles and color combinations
5. **AI Integration:** Use AI to suggest complementary colors or generate themes
   from descriptions

## Documentation

See [API_DOCUMENTATION.md](../API_DOCUMENTATION.md) for complete API reference
and usage examples.
