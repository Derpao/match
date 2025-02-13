'use client'

import { useState } from 'react'

export default function RevalidateButton() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<string>('')

  const handleRevalidate = async () => {
    setIsLoading(true)
    setStatus('กำลังล้าง Cache...')
    
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'x-revalidate-token': process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || ''
        }
      })
      
      const data = await res.json()
      
      if (res.ok) {
        setStatus('ล้าง Cache และ revalidate สำเร็จ')
        // Refresh the page after successful cache clear
        window.location.reload()
      } else {
        setStatus(`เกิดข้อผิดพลาด: ${data.message}`)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ'
      setStatus(`เกิดข้อผิดพลาด: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleRevalidate}
        disabled={isLoading}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
      >
        {isLoading ? 'กำลังดำเนินการ...' : 'ล้างแคช'}
      </button>
      {status && (
        <p className={`text-sm ${status.includes('สำเร็จ') ? 'text-green-600' : 'text-red-600'}`}>
          {status}
        </p>
      )}
    </div>
  )
}
