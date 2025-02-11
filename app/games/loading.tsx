export default function Loading() {
  return (
    <div className="w-full">
      <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-4"></div>
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="h-[160px] bg-gray-200 animate-pulse"></div>
            <div className="p-3 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                  <div className="mx-2 h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="mx-1 h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
                <div className="flex items-center">
                  <div className="mx-2 h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                  <div className="w-8 h-8 bg-gray-200 animate-pulse rounded-full"></div>
                </div>
              </div>
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}