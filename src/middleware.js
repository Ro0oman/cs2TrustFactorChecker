import { NextResponse } from 'next/server';

// Sliding Window Rate Limiting (Simple version for demo)
// In production, use Upstash Redis as planned.
const ipCache = new Map();
const LIMIT = 10; // requests
const WINDOW = 60 * 1000; // 1 minute

export function middleware(request) {
  const ip = request.ip || '127.0.0.1';
  const now = Date.now();

  if (!ipCache.has(ip)) {
    ipCache.set(ip, []);
  }

  const timestamps = ipCache.get(ip).filter(ts => now - ts < WINDOW);
  timestamps.push(now);
  ipCache.set(ip, timestamps);

  if (timestamps.length > LIMIT) {
    return new NextResponse('Too Many Requests', { 
      status: 429,
      statusText: 'Too Many Requests',
      headers: {
        'Retry-After': '60',
        'X-RateLimit-Limit': LIMIT.toString(),
        'X-RateLimit-Remaining': '0',
      }
    });
  }

  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', LIMIT.toString());
  response.headers.set('X-RateLimit-Remaining', (LIMIT - timestamps.length).toString());

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
