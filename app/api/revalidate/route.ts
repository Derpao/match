import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { clearMatchesCache } from '@/lib/getMatches'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('x-revalidate-token')

    if (!token || token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Clear in-memory cache
    clearMatchesCache()

    // Revalidate data with tag
    revalidateTag('matches')

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (error: unknown) {
    console.error('Revalidation error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ message: `Error revalidating: ${message}` }, { status: 500 })
  }
}
