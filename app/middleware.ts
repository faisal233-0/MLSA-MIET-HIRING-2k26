import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Extend globalThis with our rateLimitStore type
declare global {
  var rateLimitStore: Map<string, number> | undefined
}

export function middleware(req: NextRequest) {
  // Get client IP from x-forwarded-for
  const ipHeader = req.headers.get("x-forwarded-for")
  const ip = ipHeader ? ipHeader.split(",")[0].trim() : "unknown"

  // Block suspicious bots/scripts
  const userAgent = req.headers.get("user-agent") || ""
  if (userAgent === "" || userAgent.includes("curl") || userAgent.includes("axios") || userAgent.includes("python")) {
    return new NextResponse("Blocked: Suspicious User-Agent", { status: 403 })
  }

  // Simple IP rate limit per minute
  const now = Date.now()
  const minute = 60 * 1000
  const bucketKey = `${ip}:${Math.floor(now / minute)}`

  if (!globalThis.rateLimitStore) {
    globalThis.rateLimitStore = new Map<string, number>()
  }

  const count = globalThis.rateLimitStore.get(bucketKey) || 0
  if (count > 20) {
    return new NextResponse("Too many requests", { status: 429 })
  }
  globalThis.rateLimitStore.set(bucketKey, count + 1)

  // 3. Allow normal traffic
  return NextResponse.next()
}

// Apply only to API routes
export const config = {
  matcher: ["/api/:path*"],
}
