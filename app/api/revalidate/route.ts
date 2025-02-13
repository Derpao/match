import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  console.log('🔄 Starting cache revalidation...')
  
  try {
    const token = request.headers.get('x-revalidate-token')
    
    if (token !== process.env.NEXT_PUBLIC_REVALIDATE_TOKEN) {
      console.log('❌ Invalid token received')
      return NextResponse.json(
        { message: 'Invalid token' }, 
        { status: 401 }
      )
    }

    // Revalidate the cache using the tag
    console.log('🧹 Revalidating matches-data cache...')
    revalidateTag('matches-data')
    
    const response = NextResponse.json({ 
      revalidated: true,
      timestamp: Date.now()
    })

    // Prevent caching of the response
    response.headers.set('Cache-Control', 'no-store, must-revalidate')
    
    console.log('✅ Cache revalidation complete')
    return response

  } catch (err: unknown) {
    console.error('❌ Revalidation error:', err)
    const error = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { message: `Error revalidating: ${error}` }, 
      { status: 500 }
    )
  }
}
