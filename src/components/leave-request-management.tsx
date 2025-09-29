'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_LEAVE_REQUESTS } from '@/lib/graphql/queries';
import { UPDATE_LEAVE_REQUEST_STATUS } from '@/lib/graphql/mutations';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    name: string;
    email: string;
  };
  startDate: string;
  endDate: string;
  description: string;
  status: 'PENDING' | 'APPROVED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

interface GetLeaveRequestsQueryResult {
  leaveRequests: LeaveRequest[];
}

export default function LeaveRequestManagement() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { data, loading, refetch } = useQuery(GET_LEAVE_REQUESTS);
  const [updateLeaveRequestStatus] = useMutation(UPDATE_LEAVE_REQUEST_STATUS);

  const handleStatusUpdate = async (
    id: string,
    status: 'APPROVED' | 'CANCELLED'
  ) => {
    setError('');
    setMessage('');

    try {
      await updateLeaveRequestStatus({
        variables: {
          input: {
            id,
            status,
          },
        },
      });

      setMessage(`Leave request ${status.toLowerCase()} successfully!`);
      refetch();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while updating leave request'
      );
    }
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

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='text-center'>Loading leave requests...</div>
      </div>
    );
  }

  const leaveRequests: LeaveRequest[] =
    (data as GetLeaveRequestsQueryResult)?.leaveRequests || [];

  return (
    <div className='py-8'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        {error && (
          <div className='mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded'>
            {error}
          </div>
        )}

        {message && (
          <div className='mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded'>
            {message}
          </div>
        )}

        {leaveRequests.length === 0 ? (
          <Card>
            <CardContent className='text-center py-8'>
              <p className='text-gray-500'>No leave requests found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {leaveRequests.map((request) => (
              <Card
                key={request.id}
                className='hover:shadow-lg transition-shadow'
              >
                <CardHeader>
                  <div className='flex justify-between items-start'>
                    <div>
                      <CardTitle className='text-lg'>
                        {request.employee.name}
                      </CardTitle>
                      <CardDescription>
                        {request.employee.email}
                      </CardDescription>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      Leave Period
                    </p>
                    <p className='text-sm text-gray-600'>
                      {formatDate(request.startDate)} -{' '}
                      {formatDate(request.endDate)}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      Description
                    </p>
                    <p className='text-sm text-gray-600'>
                      {request.description}
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      Submitted
                    </p>
                    <p className='text-sm text-gray-600'>
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                  {request.status === 'PENDING' && (
                    <div className='flex space-x-2 pt-4'>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(request.id, 'APPROVED')
                        }
                        className='flex-1 bg-green-600 hover:bg-green-700'
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(request.id, 'CANCELLED')
                        }
                        variant='outline'
                        className='flex-1 border-red-300 text-red-600 hover:bg-red-50'
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
