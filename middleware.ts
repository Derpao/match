import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/login'
  const authToken = request.cookies.get('auth_token')?.value

  if (isAdminPage && !authToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isLoginPage && authToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}
