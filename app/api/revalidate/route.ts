import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { clearMatchesCache } from '@/lib/getMatches'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('x-revalidate-token')
    
    if (token !== process.env.REVALIDATE_TOKEN) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }

    // Clear in-memory cache
    clearMatchesCache()
    
    // Revalidate specific paths
    revalidatePath('/') // Revalidate home page
    revalidatePath('/matches') // Revalidate matches page
    
    return NextResponse.json({ 
      revalidated: true, 
      cacheCleared: true,
      now: Date.now() 
    })
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ message: `Error revalidating: ${error}` }, { status: 500 })
  }
}
