export default function Loading() {
  return (
    <div className="w-full">
      <div className="mb-4 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
        <div className="h-[200px] bg-gray-200 animate-pulse"></div>
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full mb-2"></div>
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
            
            <div className="h-8 w-8 bg-gray-200 animate-pulse rounded"></div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-gray-200 animate-pulse rounded-full mb-2"></div>
              <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
          <div className="h-4 w-32 bg-gray-200 animate-pulse rounded mx-auto mt-2"></div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <div className="space-y-4">
          <div className="h-10 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-32 w-full bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}
