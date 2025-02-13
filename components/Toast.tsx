'use client'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2`}>
      <span>{message}</span>
      <button 
        onClick={onClose}
        className="ml-2 hover:text-gray-200"
      >
        ✕
      </button>
    </div>
  )
}
