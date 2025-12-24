import type { VercelRequest } from '@vercel/node';

interface RateLimitResult {
  success: boolean;
  retryAfter?: number;
}

// In-memory store for rate limiting (simple implementation for serverless)
// Note: This resets on each cold start, which is acceptable for basic rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limiting utility for Vercel serverless functions
 * 
 * @param req - The Vercel request object
 * @param maxRequests - Maximum number of requests allowed in the time window
 * @param windowMs - Time window in milliseconds
 * @returns Promise<RateLimitResult> - Success status and retry-after time if limited
 * 
 * Example usage:
 * const result = await rateLimit(req, 10, 60000); // 10 requests per minute
 * if (!result.success) {
 *   return res.status(429).json({ error: 'Rate limit exceeded', retryAfter: result.retryAfter });
 * }
 */
export async function rateLimit(
  req: VercelRequest,
  maxRequests: number = 10,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  // Get client identifier (IP address or forwarded IP)
  const identifier = getClientIdentifier(req);
  const now = Date.now();

  // Get or create rate limit entry
  let entry = rateLimitStore.get(identifier);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) { // 1% chance to clean up
    cleanupExpiredEntries(now);
  }

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired entry
    entry = {
      count: 1,
      resetTime: now + windowMs
    };
    rateLimitStore.set(identifier, entry);
    return { success: true };
  }

  if (entry.count < maxRequests) {
    // Increment count
    entry.count++;
    rateLimitStore.set(identifier, entry);
    return { success: true };
  }

  // Rate limit exceeded
  const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
  return {
    success: false,
    retryAfter
  };
}

/**
 * Get client identifier from request
 * Prioritizes x-forwarded-for header (for proxied requests) over direct IP
 */
function getClientIdentifier(req: VercelRequest): string {
  // Try to get IP from x-forwarded-for header (Vercel provides this)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return ip.trim();
  }

  // Try x-real-ip header
  const realIp = req.headers['x-real-ip'];
  if (realIp) {
    return Array.isArray(realIp) ? realIp[0] : realIp;
  }

  // Fallback to a generic identifier
  return 'unknown';
}

/**
 * Clean up expired entries from the rate limit store
 * This helps prevent memory leaks in long-running serverless instances
 */
function cleanupExpiredEntries(now: number): void {
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get current rate limit status for a request (without incrementing)
 * Useful for providing rate limit headers
 */
export function getRateLimitStatus(
  req: VercelRequest,
  maxRequests: number = 10
): {
  remaining: number;
  resetTime: number;
  total: number;
} {
  const identifier = getClientIdentifier(req);
  const entry = rateLimitStore.get(identifier);
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return {
      remaining: maxRequests,
      resetTime: now + 60000,
      total: maxRequests
    };
  }

  return {
    remaining: Math.max(0, maxRequests - entry.count),
    resetTime: entry.resetTime,
    total: maxRequests
  };
}
