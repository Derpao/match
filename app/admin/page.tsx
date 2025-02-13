import { Metadata } from 'next'
import { cookies } from 'next/headers'
import RevalidateButton from './RevalidateButton'
import LogoutButton from './LogoutButton'
import MatchForm from '../../components/MatchForm'
import MatchManageForm from '../../components/MatchManageForm'
import CustomerSearchSection from '@/components/CustomerSearchSection'

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
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
          <LogoutButton />
        </div>
        
        <div className="grid gap-6">
          {/* Cache Management Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Cache Management</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Revalidate Match Data</h3>
                <RevalidateButton />
              </div>
            </div>
          </div>

          {/* Match Management Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Match Management</h2>
            <MatchForm />
          </div>

          {/* Existing Matches Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Manage Existing Matches</h2>
            <MatchManageForm />
          </div>

          {/* Customer Search Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Customer Search</h2>
            <CustomerSearchSection />
          </div>
        </div>
      </div>
    </div>
  )
}
