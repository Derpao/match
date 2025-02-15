'use client'

import { useState } from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/solid'

interface PredictionCount {
  scoreA: number;
  scoreB: number;
  count: number;
}

interface PredictionStatsProps {
  teamA: string;
  teamB: string;
  stats: PredictionCount[];
}

export default function PredictionStats({ teamA, teamB, stats }: PredictionStatsProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="mt-4">
      <div className="rounded-lg border border-gray-200 bg-white">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="text-lg font-medium text-blue-600">
            ยอดรวมผู้ทายผล
          </h3>
          <ChevronUpIcon 
            className={`w-5 h-5 text-blue-600 transition-transform duration-300 ease-in-out
              ${isOpen ? '' : 'transform rotate-180'}`}
          />
        </button>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden
            ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="p-4 text-sm text-gray-600 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-2">
              {stats.map(({ scoreA, scoreB, count }, index) => (
                <div 
                  key={index}
                  className="flex items-center px-3 py-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <span className="font-medium truncate">
                      {teamA} {scoreA} - {scoreB} {teamB}
                    </span>
                  </div>
                  <div className="text-blue-600 font-medium ml-4 whitespace-nowrap">
                    {count.toLocaleString()} คน
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
