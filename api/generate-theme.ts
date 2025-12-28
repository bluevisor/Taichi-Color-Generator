import type { VercelRequest, VercelResponse } from '@vercel/node';
import { generatePalette } from '../utils/paletteEngine';
import { GenerationMode } from '../types';

// Inline rate limiting implementation
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getClientIP(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return ip.trim();
  }
  return 'unknown';
}

async function rateLimit(req: VercelRequest, max: number, windowMs: number) {
  const ip = getClientIP(req);
  const now = Date.now();
  let entry = rateLimitStore.get(ip);
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    return { success: true };
  }
  
  if (entry.count < max) {
    entry.count++;
    return { success: true };
  }
  
  return { success: false, retryAfter: Math.ceil((entry.resetTime - now) / 1000) };
}

/**
 * API Endpoint: Generate Theme
 * 
 * Generates balanced Light & Dark themes using the OKLCH Palette Engine.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  // Apply rate limiting (10 requests per minute per IP)
  const rateLimitResult = await rateLimit(req, 10, 60000);
  if (!rateLimitResult.success) {
    return res.status(429).json({
      success: false,
      error: 'Rate limit exceeded. Please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: rateLimitResult.retryAfter
    });
  }

  try {
    const { 
      style = 'random', 
      baseColor, 
      lockedColors = [],
      saturation = 0,
      contrast = 0,
      brightness = 0
    } = req.body || {};

    // Validate style parameter
    const validStyles = [
      'monochrome', 'analogous', 'complementary', 'split-complementary', 
      'triadic', 'tetradic', 'compound', 'triadic-split', 'random'
    ];
    
    if (!validStyles.includes(style)) {
      return res.status(400).json({
        success: false,
        error: `Invalid style. Must be one of: ${validStyles.join(', ')}`,
        code: 'INVALID_STYLE'
      });
    }

    // Validate numeric parameters
    const checkRange = (val: any) => typeof val === 'number' && val >= -5 && val <= 5;
    if (!checkRange(saturation) || !checkRange(contrast) || !checkRange(brightness)) {
      return res.status(400).json({
        success: false,
        error: 'Parameters saturation, contrast, and brightness must be numbers between -5 and 5.',
        code: 'INVALID_PARAMETERS'
      });
    }

    // Validate baseColor if provided
    if (baseColor && !/^#[0-9A-F]{6}$/i.test(baseColor)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid baseColor format. Must be a hex color (e.g., #FF5733)',
        code: 'INVALID_BASE_COLOR'
      });
    }

    // Generate theme using the Advanced OKLCH Engine
    const result = generatePalette(
      style as GenerationMode, 
      baseColor, 
      saturation, 
      contrast, 
      brightness
    );

    return res.status(200).json({
      success: true,
      light: result.light,
      dark: result.dark,
      metadata: {
        style: result.mode,
        seed: result.seed,
        timestamp: Date.now(),
        philosophy: getPhilosophy(result.mode)
      }
    });

  } catch (error) {
    console.error('Error generating theme:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error while generating theme',
      code: 'INTERNAL_ERROR'
    });
  }
}

// Get philosophy description for each style
function getPhilosophy(style: string): string {
  const philosophies: Record<string, string> = {
    'monochrome': 'Unity and simplicity through variations of a single hue.',
    'analogous': 'Harmony found in nature by choosing neighboring colors on the wheel.',
    'complementary': 'High-energy contrast by pairing opposites for maximum impact.',
    'split-complementary': 'Visual variety with less tension than a direct complement.',
    'triadic': 'A vibrant, balanced triangle of color for a bold UI.',
    'tetradic': 'Rich and complex harmony using four colors in two complementary pairs.',
    'compound': 'Balanced sophistication using multiple contrasting and adjacent hues.',
    'triadic-split': 'A wide, dynamic palette for complex design systems.',
    'random': 'Embracing spontaneity and the natural flow of creative energy.'
  };
  
  return philosophies[style] || philosophies.random;
}

