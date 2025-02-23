'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Prediction } from '@/types/prediction'
import ConfirmModal from './ConfirmModal'
import NotificationModal from './NotificationModal'

export default function LotterySearchSection() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    prediction: null as Prediction | null,
    newStatus: false
  })
  const [notificationModal, setNotificationModal] = useState({
    isOpen: false,
    message: ''
  })

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }

  const formatThaiDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setPredictions([])

    try {
      // ทดสอบการเชื่อมต่อ
      console.log('Testing Supabase connection...')
      const { data: testData, error: testError } = await supabase
        .from('predictions')
        .select('count')
        .single()

      if (testError) {
        console.error('Connection test error:', testError)
        throw new Error('ไม่สามารถเชื่อมต่อกับฐานข้อมูลได้')
      }

      console.log('Connection test result:', testData)

      // ดึงข้อมูลทั้งหมด
      const { data: allData, error: listError } = await supabase
        .from('predictions')
        .select('*')

      if (listError) {
        console.error('List error:', listError)
        throw listError
      }

      console.log('Total records:', allData?.length)
      console.log('All predictions:', allData)

      // ค้นหาด้วยเบอร์โทร
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('phone_number', phoneNumber) // เปลี่ยนจาก ilike เป็น eq
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Search error:', error)
        throw error
      }

      console.log('Search results for:', phoneNumber)
      console.log('Found records:', data?.length)
      console.log('Results:', data)

      setPredictions(data || [])
    } catch (error) {
      console.error('Error details:', error)
      alert(error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการค้นหา')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d+$/.test(value)) {
      setPhoneNumber(value)
    }
  }

  const toggleRewardStatus = async (prediction: Prediction) => {
    const newStatus = !prediction.received_reward
    setConfirmModal({
      isOpen: true,
      prediction,
      newStatus
    })
  }

  const handleConfirm = async () => {
    if (!confirmModal.prediction) return

    try {
      const { error } = await supabase
        .from('predictions')
        .update({ received_reward: confirmModal.newStatus })
        .eq('id', confirmModal.prediction.id)
        .select()

      if (error) throw error

      setPredictions(predictions.map(p => 
        p.id === confirmModal.prediction?.id
          ? { ...p, received_reward: confirmModal.newStatus }
          : p
      ))

      setNotificationModal({
        isOpen: true,
        message: `อัพเดทสถานะเป็น "${confirmModal.newStatus ? 'ได้รับรางวัล' : 'ยังไม่ได้รับรางวัล'}" เรียบร้อยแล้ว`
      })
    } catch (error) {
      console.error('Update error:', error)
      setNotificationModal({
        isOpen: true,
        message: 'เกิดข้อผิดพลาดในการอัพเดทสถานะ'
      })
    }

    setConfirmModal({ isOpen: false, prediction: null, newStatus: false })
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={phoneNumber}
          onChange={handlePhoneInput}
          placeholder="ค้นหาด้วยเบอร์โทรศัพท์"
          pattern="[0-9]{10}"
          maxLength={10}
          className="flex-1 p-2 border rounded text-black"
          required
        />
        <button
          type="submit"
          disabled={loading || phoneNumber.length !== 10}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
        </button>
      </form>

      {predictions.length > 0 && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เบอร์โทรศัพท์
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เลขที่ทาย
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  งวดวันที่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เวลาที่ทาย
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  สถานะรางวัล
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-black">
              {predictions.map((prediction) => (
                <tr key={prediction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {prediction.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                    {prediction.prediction_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {formatThaiDate(prediction.lottery_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    {prediction.created_at ? formatThaiDateTime(prediction.created_at) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                    <button
                      onClick={() => toggleRewardStatus(prediction)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        prediction.received_reward
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {prediction.received_reward ? 'ได้รับรางวัลแล้ว' : 'ยังไม่ได้รับรางวัล'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {predictions.length === 0 && phoneNumber.length === 10 && !loading && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            ไม่พบข้อมูลการทายสำหรับเบอร์โทรศัพท์นี้
          </p>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="ยืนยันการเปลี่ยนสถานะ"
        message={confirmModal.prediction ? `
เบอร์โทรศัพท์: ${confirmModal.prediction.phone_number}
เลขที่ทาย: ${confirmModal.prediction.prediction_number}
งวดวันที่: ${formatThaiDate(confirmModal.prediction.lottery_date)}
สถานะใหม่: ${confirmModal.newStatus ? 'ได้รับรางวัล' : 'ยังไม่ได้รับรางวัล'}` : ''}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmModal({ isOpen: false, prediction: null, newStatus: false })}
      />

      <NotificationModal
        isOpen={notificationModal.isOpen}
        message={notificationModal.message}
        onClose={() => setNotificationModal({ isOpen: false, message: '' })}
      />
    </div>
  )
}
