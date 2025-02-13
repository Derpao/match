import { Metadata } from 'next'
import { cookies } from 'next/headers'
import RevalidateButton from './RevalidateButton'
import LogoutButton from './LogoutButton'

export const metadata: Metadata = {
  title: 'Admin - Football Prediction',
}

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('auth_token')

  if (!authToken) {
    return null // This should never happen due to middleware
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Cache Management</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Revalidate Match Data</h3>
            <RevalidateButton />
          </div>
        </div>
      </div>
    </div>
  )
}
