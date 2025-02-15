export default function Loading() {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center justify-center">
      <div className="relative w-20 h-20">
        <div className="absolute top-0 left-0 right-0 bottom-0">
          <div className="w-20 h-20 border-8 border-gray-200 rounded-full animate-spin border-t-blue-600"/>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg
            className="w-12 h-12 text-blue-600"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 3.3l1.35-.95c1.82.56 3.37 1.76 4.38 3.34l-.39 1.34-1.35.46L13 9.2V5.3zm-2 0V9.2L7.01 7.49l-1.35-.46-.39-1.34c1.01-1.57 2.56-2.77 4.38-3.34L11 5.3zm-1.57 5.2L6.4 13l-1.81-.85c-.07-.71-.07-1.44 0-2.15l1.85-.63 3.04 1.13zm-1.95 4.81l.39-1.34 1.35-.46L13 14.8v3.89l-1.35.95c-1.82-.56-3.37-1.76-4.38-3.34zm7.04 0c-1.01 1.57-2.56 2.77-4.38 3.34l-1.35-.95V14.8l2.99-1.5 1.35.46.39 1.34z"/>
          </svg>
        </div>
      </div>
      <p className="mt-4 text-gray-600 font-medium animate-pulse">
        กำลังโหลดข้อมูล...
      </p>
    </div>
  )
}


// export default function Loading() {
//   return (
//     <div className="w-full">
//       <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse"/>
//       <div className="flex flex-col gap-4">
//         {[...Array(3)].map((_, i) => (
//           <div key={i} className="border border-gray-100 rounded-lg overflow-hidden">
//             <div className="h-[160px] bg-gray-200 animate-pulse"/>
//             <div className="p-3 bg-gray-50">
//               <div className="flex justify-between items-center">
//                 <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"/>
//                 <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"/>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }