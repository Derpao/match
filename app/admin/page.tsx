import { Metadata } from 'next'
import { cookies } from 'next/headers'
import RevalidateButton from './RevalidateButton'
import LogoutButton from './LogoutButton'
import MatchForm from '../../components/MatchForm'
import MatchManageForm from '../../components/MatchManageForm'
import CustomerSearchSection from '@/components/CustomerSearchSection'
import Link from 'next/link'
import LotterySearchSection from '@/components/LotterySearchSection'
import LotteryNumberSearchSection from '@/components/LotteryNumberSearchSection'

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
                <div className="flex justify-between">
                  <RevalidateButton />
                  <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                  Home Page
                  </Link>
                </div>
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

          {/* Lottery Number Search Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">ค้นหาตามเลขที่ทาย</h2>
            <LotteryNumberSearchSection />
          </div>

          {/* Lottery Search Section */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">ค้นหาประวัติการทายผลหวย</h2>
            <LotterySearchSection />
          </div>
        </div>
      </div>
    </div>
  )
}
