'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Toast from './Toast'
import { convertThaiToISODate } from '@/lib/dateUtils'

export default function MatchForm() {
  const [formData, setFormData] = useState({
    teamA: '',
    teamB: '',
    logoA: '',
    logoB: '',
    matchtime: '',
    date: '',
    time: ''
  })
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleDateTimeChange = (date: string, time: string) => {
    if (!date || !time) return

    const [yearCE, month, day] = date.split('-')
    const yearBE = parseInt(yearCE) + 543
    const thaiDateTime = `${day}/${month}/${yearBE} ${time}`

    setFormData(prev => ({
      ...prev,
      matchtime: thaiDateTime,
      date,
      time
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!confirm('Are you sure you want to create this match?')) return

    // Convert Thai date to ISO format before sending to database
    const isoDate = convertThaiToISODate(formData.matchtime)

    const { error } = await supabase
      .from('matches_insert')
      .insert([
        {
          teams_info: {
            teamA: formData.teamA,
            teamB: formData.teamB,
            logoA: formData.logoA,
            logoB: formData.logoB
          },
          matchtime: isoDate
        }
      ])

    if (!error) {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'x-revalidate-token': process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || ''
        }
      })
      setFormData({
        teamA: '',
        teamB: '',
        logoA: '',
        logoB: '',
        matchtime: '',
        date: '',
        time: ''
      })
      showToast('Match created successfully!', 'success')
    } else {
      showToast('Failed to create match', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Team A</label>
          <input
            type="text"
            value={formData.teamA}
            onChange={(e) => setFormData({ ...formData, teamA: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Team B</label>
          <input
            type="text"
            value={formData.teamB}
            onChange={(e) => setFormData({ ...formData, teamB: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Logo A URL</label>
          <input
            type="text"
            value={formData.logoA}
            onChange={(e) => setFormData({ ...formData, logoA: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Logo B URL</label>
          <input
            type="text"
            value={formData.logoB}
            onChange={(e) => setFormData({ ...formData, logoB: e.target.value })}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">วันที่แข่ง</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => handleDateTimeChange(e.target.value, formData.time)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">เวลาที่แข่ง</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => handleDateTimeChange(formData.date, e.target.value)}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Match
      </button>
    </form>
  )
}