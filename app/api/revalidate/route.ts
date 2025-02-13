import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('x-revalidate-token')
    
    if (token !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
    }
    
    // Revalidate cache using tag
    revalidateTag('matches')
    
    return NextResponse.json({ 
      revalidated: true,
      now: Date.now() 
    })
  } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ message: `Error revalidating: ${error}` }, { status: 500 })
  }
}
