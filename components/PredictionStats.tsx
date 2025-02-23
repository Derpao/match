'use client'

import { useState, useEffect } from 'react'
import { getCurrentLottery } from '@/app/lottery/utils' // Import draw date from utils

interface PredictionCount {
  number: string;
  count: number;
}

export default function PredictionStats() {
  const [isOpen, setIsOpen] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionCount[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    // Use lottery draw date from utils.ts
    const lottery = getCurrentLottery();
    const drawDate = new Date(lottery.targetDate);
    const currentDate = new Date();
    
    // Set totalDays and compute daysRemaining.
    const totalDays = 15;
    const daysRemaining = Math.ceil((drawDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24));
    
    // Compute ratio: 0 = far from draw, 1 = draw day.
    const ratio = 1 - daysRemaining / totalDays;
    // For far away: lower=10 and upper=50, near draw: lower=180 and upper=220.
    const lowerBound = Math.floor(10 + (180 - 10) * ratio);
    const upperBound = Math.floor(50 + (220 - 50) * ratio);
    const range = upperBound - lowerBound;
    
    // Use draw date's midnight as fixed seed for consistency.
    const lotterySeed = new Date(drawDate).setHours(0, 0, 0, 0);

    // Simple seeded random using mulberry32.
    function mulberry32(a: number) {
      return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      }
    }

    const newData: PredictionCount[] = Array.from({ length: 100 }, (_, i) => {
      // Fixed seeded randomness per number.
      const fixedRandom = mulberry32(lotterySeed + i)();
      let finalCount = lowerBound + Math.floor(fixedRandom * (range + 1));
      if (finalCount > upperBound) finalCount = upperBound;
      return {
        number: i.toString().padStart(2, '0'),
        count: finalCount
      };
    });
    setPredictionData(newData);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-6 w-full">
      <button
        className="w-full flex justify-between items-center p-4 bg-[#2D3D99] hover:bg-[#2D3D99]/90 text-white rounded-lg transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>ยอดรวมผู้ทายผล</span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180 transform' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="mt-2 rounded-lg border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-2 font-semibold border-b border-gray-200 pb-2 mb-2 text-black">
            <div>หมายเลข</div>
            <div>จำนวนคำทาย</div>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {predictionData.map(({ number, count }) => (
              <div key={number} className="grid grid-cols-2 py-1 text-sm text-gray-600">
                <div>{number}</div>
                <div>{count} คน</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
