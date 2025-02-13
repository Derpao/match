'use client'

import { useState } from 'react'

export default function RevalidateButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleRevalidate = async () => {
    try {
      setStatus('loading')
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'x-revalidate-token': '6f50d78788f8056b5d383f7fbe7935c6c62ad3646a37f0b60ad0ddeeff5288b3'
        }
      })

      const data = await res.json()
      
      if (!res.ok) throw new Error(data.message || 'Revalidation failed')
      
      setStatus('success')
      setMessage('Cache revalidated successfully!')
      
      setTimeout(() => {
        setStatus('idle')
        setMessage('')
      }, 3000)

    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleRevalidate}
        disabled={status === 'loading'}
        className={`
          px-4 py-2 rounded-md text-white font-medium
          ${status === 'loading' ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}
          disabled:cursor-not-allowed transition-colors
        `}
      >
        {status === 'loading' ? 'Revalidating...' : 'Revalidate Cache'}
      </button>
      
      {message && (
        <p className={`text-sm ${
          status === 'error' ? 'text-red-600' : 'text-green-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}
