'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { GET_EMPLOYEE_LEAVE_REQUESTS } from '@/lib/graphql/queries';
import LeaveRequestForm from '@/components/leave-request-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, Calendar } from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface GetEmployeeLeaveRequestsQueryResult {
  employeeLeaveRequests: LeaveRequest[];
}

export default function EmployeeLeaveRequestPage() {
  const [showForm, setShowForm] = useState(false);
  const [employeeId, setEmployeeId] = useState<string>('');
  const router = useRouter();
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setEmployeeId(parsedUser.id);
    } else {
      router.push('/auth/signin');
    }
  }, [router]);

  const { data, loading, refetch } = useQuery(GET_EMPLOYEE_LEAVE_REQUESTS, {
    variables: { employeeId },
    skip: !employeeId, // Skip query if no employee ID
  });

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefetchTrigger((prev) => prev + 1);
    refetch();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'APPROVED':
        return 'text-green-600 bg-green-100';
      case 'CANCELLED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!employeeId || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  const leaveRequests =
    (data as GetEmployeeLeaveRequestsQueryResult)?.employeeLeaveRequests || [];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center'>
              <Calendar className='h-8 w-8 text-blue-600 mr-3' />
              <div>
                <h1 className='text-2xl font-bold text-gray-900'>
                  My Leave Requests
                </h1>
                <p className='text-sm text-gray-600'>
                  Submit and track your leave of absence requests
                </p>
              </div>
            </div>
            <Button variant='outline' onClick={() => router.push('/dashboard')}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-6'>
          <button
            onClick={() => setShowForm(!showForm)}
            className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium'
          >
            {showForm ? 'Cancel' : 'Submit New Leave Request'}
          </button>
        </div>

        {showForm && (
          <div className='mb-8'>
            <LeaveRequestForm
              employeeId={employeeId}
              onSuccess={handleFormSuccess}
            />
          </div>
        )}

        {leaveRequests.length === 0 ? (
          <Card>
            <CardContent className='text-center py-8'>
              <p className='text-gray-500'>No leave requests found.</p>
              <p className='text-gray-400 text-sm mt-2'>
                Submit your first leave request using the button above.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6'>
            {leaveRequests.map((request: LeaveRequest) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className='flex justify-between items-start'>
                    <div>
                      <CardTitle className='text-lg'>Leave Request</CardTitle>
                      <CardDescription>
                        Submitted on {formatDate(request.createdAt)}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <p className='text-sm font-medium text-gray-700'>
                        Start Date
                      </p>
                      <p className='text-sm text-gray-600'>
                        {formatDate(request.startDate)}
                      </p>
                    </div>
                    <div>
                      <p className='text-sm font-medium text-gray-700'>
                        End Date
                      </p>
                      <p className='text-sm text-gray-600'>
                        {formatDate(request.endDate)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      Description
                    </p>
                    <p className='text-sm text-gray-600'>
                      {request.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
