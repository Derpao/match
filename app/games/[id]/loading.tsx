export default function Loading() {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"/>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg 
            className="w-8 h-8 text-blue-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zm-6 0a6 6 0 00-6 6v7h4v-7a2 2 0 012-2 2 2 0 012 2v7h4v-7a6 6 0 00-6-6z"
            />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">
        กำลังโหลดข้อมูล...
      </p>
    </div>
  )
}