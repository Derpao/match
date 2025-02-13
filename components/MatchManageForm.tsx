'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import Toast from './Toast'
import ConfirmationModal from './ConfirmationModal'
import { convertThaiToISODate, convertISOToThaiDate } from '@/lib/manageMatchDateUtils'

interface Match {
  id: number
  teams_info: {
    teamA: string
    teamB: string
    logoA: string
    logoB: string
  }
  matchtime: string
}

export default function MatchManageForm() {
  const [matches, setMatches] = useState<Match[]>([])
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    action: 'update' | 'delete';
    match?: Match;
    matchId?: number;
  }>({ isOpen: false, action: 'update' })

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    const { data } = await supabase
      .from('matches_insert')
      .select('*')
      .order('matchtime', { ascending: true })

    if (data) {
      const formattedData = data.map(match => ({
        ...match,
        matchtime: convertISOToThaiDate(match.matchtime)
      }))
      setMatches(formattedData)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleUpdate = async (match: Match) => {
    setConfirmModal({
      isOpen: true,
      action: 'update',
      match: match
    })
  }

  const handleDelete = async (id: number) => {
    setConfirmModal({
      isOpen: true,
      action: 'delete',
      matchId: id
    })
  }

  const confirmUpdate = async (match: Match) => {
    // Convert Thai date back to ISO before saving
    const isoDate = convertThaiToISODate(match.matchtime)
    
    const result = await supabase
      .from('matches_insert')
      .update({
        teams_info: match.teams_info,
        matchtime: isoDate
      })
      .eq('id', match.id)

    if (!result.error) {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'x-revalidate-token': process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || ''
        }
      })
      fetchMatches()
      setEditingMatch(null)
      showToast('Match updated successfully!', 'success')
    } else {
      showToast('Failed to update match', 'error')
    }
    setConfirmModal({ isOpen: false, action: 'update' })
  }

  const confirmDelete = async (id: number) => {
    const result = await supabase
      .from('matches_insert')
      .delete()
      .eq('id', id)

    if (!result.error) {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'x-revalidate-token': process.env.NEXT_PUBLIC_REVALIDATE_TOKEN || ''
        }
      })
      fetchMatches()
      showToast('Match deleted successfully!', 'success')
    } else {
      showToast('Failed to delete match', 'error')
    }
    setConfirmModal({ isOpen: false, action: 'delete' })
  }

  const formatDateTimeForInput = (thaiDateTime: string) => {
    try {
      const [datePart, timePart] = thaiDateTime.split(' ')
      const [day, month, yearBE] = datePart.split('/')
      const yearCE = parseInt(yearBE) - 543
      return {
        date: `${yearCE}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
        time: timePart
      }
    } catch {
      return { date: '', time: '' }
    }
  }

  const handleDateTimeChange = (match: Match, date: string, time: string) => {
    if (!date || !time) return

    const [yearCE, month, day] = date.split('-')
    const yearBE = parseInt(yearCE) + 543
    const thaiDateTime = `${day}/${month}/${yearBE} ${time}`

    setEditingMatch({
      ...match,
      matchtime: thaiDateTime
    })
  }

  return (
    <div className="space-y-4">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.action === 'update' ? 'Update Match' : 'Delete Match'}
        message={
          confirmModal.action === 'update'
            ? 'Are you sure you want to update this match?'
            : 'Are you sure you want to delete this match? This action cannot be undone.'
        }
        onConfirm={() => {
          if (confirmModal.action === 'update' && confirmModal.match) {
            confirmUpdate(confirmModal.match)
          } else if (confirmModal.action === 'delete' && confirmModal.matchId) {
            confirmDelete(confirmModal.matchId)
          }
        }}
        onCancel={() => setConfirmModal({ isOpen: false, action: 'update' })}
      />

      {matches.map((match) => (
        <div key={match.id} className="border p-4 rounded-lg bg-gray-50">
          {editingMatch?.id === match.id ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team A</label>
                  <input
                    type="text"
                    value={editingMatch.teams_info.teamA}
                    onChange={(e) => setEditingMatch({
                      ...editingMatch,
                      teams_info: {
                        ...editingMatch.teams_info,
                        teamA: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Team B</label>
                  <input
                    type="text"
                    value={editingMatch.teams_info.teamB}
                    onChange={(e) => setEditingMatch({
                      ...editingMatch,
                      teams_info: {
                        ...editingMatch.teams_info,
                        teamB: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo A URL</label>
                  <input
                    type="text"
                    value={editingMatch.teams_info.logoA}
                    onChange={(e) => setEditingMatch({
                      ...editingMatch,
                      teams_info: {
                        ...editingMatch.teams_info,
                        logoA: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Logo B URL</label>
                  <input
                    type="text"
                    value={editingMatch.teams_info.logoB}
                    onChange={(e) => setEditingMatch({
                      ...editingMatch,
                      teams_info: {
                        ...editingMatch.teams_info,
                        logoB: e.target.value
                      }
                    })}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">วันที่แข่ง</label>
                  <input
                    type="date"
                    value={formatDateTimeForInput(editingMatch.matchtime).date}
                    onChange={(e) => handleDateTimeChange(
                      editingMatch,
                      e.target.value,
                      formatDateTimeForInput(editingMatch.matchtime).time
                    )}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">เวลาแข่ง</label>
                  <input
                    type="time"
                    value={formatDateTimeForInput(editingMatch.matchtime).time}
                    onChange={(e) => handleDateTimeChange(
                      editingMatch,
                      formatDateTimeForInput(editingMatch.matchtime).date,
                      e.target.value
                    )}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(editingMatch)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingMatch(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{match.teams_info.teamA} vs {match.teams_info.teamB}</h3>
                  <p className="text-sm text-gray-600">{match.matchtime}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMatch(match)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(match.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
