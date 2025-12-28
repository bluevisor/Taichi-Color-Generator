# API Test Suite

This directory contains comprehensive tests for the Taichi Theme Generator API.

## Test Files

| File                 | Description                       | Run Command           |
| -------------------- | --------------------------------- | --------------------- |
| `api.test.ts`        | Jest test suite                   | `npm test`            |
| `manual-api-test.js` | Node.js script for manual testing | `npm run test:manual` |

## Running Tests

### Jest Tests (Requires local server)

```bash
# Start local dev server first
vercel dev

# In another terminal, run tests
npm test
```

### Manual Tests (Uses production API)

```bash
npm run test:manual
```

Or specify a custom API URL:

```bash
API_BASE_URL=http://localhost:3000/api npm run test:manual
```

## Test Coverage

### 1. Generate Theme API (`/api/generate-theme`)

| Test Case           | Description                                              |
| ------------------- | -------------------------------------------------------- |
| Random theme        | Generates light + dark themes with 20 tokens each        |
| Analogous theme     | Tests analogous harmony mode                             |
| Triadic theme       | Tests triadic harmony mode                               |
| Complementary theme | Tests complementary harmony mode                         |
| All 9 styles        | Iterates through all valid harmony modes                 |
| Base color          | Generates theme seeded from a hex color                  |
| Saturation param    | Tests saturation adjustment (-5 to 5)                    |
| Contrast param      | Tests contrast adjustment (-5 to 5)                      |
| Brightness param    | Tests brightness adjustment (-5 to 5)                    |
| All params combined | Tests all parameters together                            |
| Invalid style       | Rejects unknown style with `INVALID_STYLE`               |
| Invalid base color  | Rejects malformed hex with `INVALID_BASE_COLOR`          |
| Out-of-range params | Rejects values outside -5 to 5 with `INVALID_PARAMETERS` |
| Wrong HTTP method   | Rejects GET with `METHOD_NOT_ALLOWED`                    |
| CORS preflight      | Returns 200 for OPTIONS request                          |

### 2. Export Theme API (`/api/export-theme`)

| Test Case       | Description                                  |
| --------------- | -------------------------------------------- |
| CSS export      | Exports theme as CSS custom properties       |
| SCSS export     | Exports theme as SCSS variables              |
| LESS export     | Exports theme as LESS variables              |
| Tailwind export | Exports theme as Tailwind config             |
| JSON export     | Exports raw JSON                             |
| Custom prefix   | Uses custom variable prefix                  |
| No comments     | Excludes comments when requested             |
| Invalid format  | Rejects unknown format with `INVALID_FORMAT` |
| Missing theme   | Rejects empty request with `INVALID_THEME`   |

### 3. CORS Support

| Test Case     | Description                                              |
| ------------- | -------------------------------------------------------- |
| All endpoints | Verify `Access-Control-Allow-Origin: *` on all endpoints |

### 4. Integration Test

| Test Case     | Description                             |
| ------------- | --------------------------------------- |
| Full workflow | Generate -> Export -> Verify CSS output |

## Expected Response Format

### Generate Theme Response

```json
{
  "success": true,
  "light": {/* 20 tokens */},
  "dark": {/* 20 tokens */},
  "metadata": {
    "style": "analogous",
    "seed": "#3B82F6",
    "timestamp": 1703376000000,
    "philosophy": "..."
  }
}
```

### Expected Tokens (20 per theme)

- `bg`, `card`, `card2`
- `text`, `textMuted`, `textOnColor`
- `primary`, `primaryFg`
- `secondary`, `secondaryFg`
- `accent`, `accentFg`
- `border`, `ring`
- `good`, `goodFg`
- `warn`, `warnFg`
- `bad`, `badFg`

## Adding New Tests

1. Add test cases to `api.test.ts` for Jest-based testing
2. Add corresponding tests to `manual-api-test.js` for quick manual verification
3. Update this README with new test descriptions
