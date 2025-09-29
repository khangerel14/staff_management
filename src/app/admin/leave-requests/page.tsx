'use client';

import { useRouter } from 'next/navigation';
import LeaveRequestManagement from '@/components/leave-request-management';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function AdminLeaveRequestPage() {
  const router = useRouter();

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center'>
              <Calendar className='h-8 w-8 text-blue-600 mr-3' />
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  Leave Request Management
                </h1>
                <p className='text-sm text-gray-600'>
                  Review and manage employee leave requests
                </p>
              </div>
            </div>
            <Button variant='outline' onClick={() => router.push('/admin')}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Admin Dashboard
            </Button>
          </div>
        </div>
      </header>

      <LeaveRequestManagement />
    </div>
  );
}
