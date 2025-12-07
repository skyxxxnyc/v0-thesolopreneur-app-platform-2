import { NextResponse, type NextRequest } from "next/server"

// Auth is handled client-side for now to avoid import errors in v0 environment

export async function proxy(request: NextRequest) {
  // For now, just pass through all requests
  // Client-side components will handle auth redirects
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
