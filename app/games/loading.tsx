export default function Loading() {
  return (
    <div className="w-full">
      <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"/>
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
            <div className="h-[160px] bg-gray-200 animate-pulse"/>
            <div className="p-3 bg-gray-50">
              <div className="flex justify-between items-center">
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"/>
                <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}