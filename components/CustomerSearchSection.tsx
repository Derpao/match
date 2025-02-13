'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Prediction {
  id: string  // Changed from number to string for UUID
  team_a: string
  team_b: string
  score_a: number
  score_b: number
  phone_number: string
  submission_time: string
  created_at: string
  coupon: number | null  // Changed to be explicit about nullable
}

export default function CustomerSearchSection() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')
  const [updatingCouponId, setUpdatingCouponId] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!phoneNumber) {
        setError('กรุณากรอกเบอร์โทรศัพท์');
        return;
    }

    setIsSearching(true);
    setError('');

    try {
        const { data, error } = await supabase
            .from('MatchPredict')
            .select('*')
            .eq('phone_number', phoneNumber)
            .order('submission_time', { ascending: false });

        if (error) {
            console.error('Error fetching predictions:', error);
            throw error;
        }

        console.log('Fetched predictions:', data); // Log the fetched predictions

        if (data && Array.isArray(data)) {
            setPredictions(data);
            if (data.length === 0) {
                setError('ไม่พบข้อมูลการทำนายผลสำหรับเบอร์โทรศัพท์นี้');
            }
        } else {
            console.warn('No predictions found or invalid data format.');
            setPredictions([]); // Ensure predictions is empty
            setError('ไม่พบข้อมูลการทำนายผลสำหรับเบอร์โทรศัพท์นี้');
        }
    } catch (err) {
        console.error('Error searching predictions:', err);
        setError('เกิดข้อผิดพลาดในการค้นหาข้อมูล');
    } finally {
        setIsSearching(false);
    }
  }

  // เพิ่มฟังก์ชันสำหรับรีโหลดข้อมูล
  const reloadPredictions = async (phoneNumber: string) => {
    const { data, error } = await supabase
      .from('MatchPredict')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('submission_time', { ascending: false })

    if (!error && data) {
      setPredictions(data)
    }
  }

  const handleCouponChange = async (predictionId: string, newValue: string) => {
    setUpdatingCouponId(predictionId);
    try {
        const numericValue = parseInt(newValue, 10);
        console.log('Attempting update:', { predictionId, numericValue });

        const { error } = await supabase
            .from('MatchPredict')
            .update({ coupon: numericValue })
            .eq('id', predictionId)

        if (error) {
            console.error('Supabase update error:', error);
            throw error;
        }

        // Directly update local state
        setPredictions((prevPredictions) =>
            prevPredictions.map((pred) =>
                pred.id === predictionId ? { ...pred, coupon: numericValue } : pred
            )
        );

        // Verify the update by fetching the record again
        const { data: verifyData, error: verifyError } = await supabase
            .from('MatchPredict')
            .select('*')
            .eq('id', predictionId)
            .single();

        if (verifyError) {
            console.error('Verification error:', verifyError);
        } else {
            console.log('Verified data from Supabase:', verifyData);
        }

        // Reload predictions after successful update
        await reloadPredictions(phoneNumber);

        alert('อัพเดทสถานะ Coupon สำเร็จ');
    } catch (err) {
        console.error('Error in handleCouponChange:', err);
        alert('ไม่สามารถอัพเดทสถานะ Coupon ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
        setUpdatingCouponId(null);
    }
}

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-black">ค้นหาประวัติการทำนายผล</h2>
      
      <div className="flex gap-4 mb-6">
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="กรอกเบอร์โทรศัพท์"
          className="flex-1 h-10 px-3 rounded-lg border border-gray-300 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 bg-blue-600 text-white rounded-lg disabled:bg-gray-400 hover:bg-blue-700"
        >
          {isSearching ? 'กำลังค้นหา...' : 'ค้นหา'}
        </button>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4">{error}</p>
      )}

      {predictions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 text-black">วันที่ทำนาย</th>
                <th className="px-4 py-2 text-black">การแข่งขัน</th>
                <th className="px-4 py-2 text-black">ผลที่ทาย</th>
                <th className="px-4 py-2 text-black">วันที่บันทึก</th>
                <th className="px-4 py-2 text-black">Coupon</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr key={prediction.id} className="border-t">
                  <td className="px-4 py-2 text-black">
                    {new Date(prediction.submission_time).toLocaleString('th-TH')}
                  </td>
                  <td className="px-4 py-2 text-black">
                    {prediction.team_a} VS {prediction.team_b}
                  </td>
                  <td className="px-4 py-2 text-black">
                    {prediction.score_a} - {prediction.score_b}
                  </td>
                  <td className="px-4 py-2 text-black">
                    {new Date(prediction.created_at).toLocaleString('th-TH')}
                  </td>
                  <td className="px-4 py-2 text-black">
                    <div className="flex items-center gap-2">
                      <select
                        value={prediction.coupon?.toString() || '0'}
                        onChange={(e) => handleCouponChange(prediction.id, e.target.value)}
                        disabled={updatingCouponId === prediction.id}
                        className="px-2 py-1 rounded border border-gray-300 bg-white text-black"
                      >
                        <option value="0">ยังไม่ได้รับ</option>
                        <option value="1">ได้รับแล้ว</option>
                      </select>
                      {updatingCouponId === prediction.id && (
                        <span className="text-xs text-blue-500">กำลังอัพเดท...</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
