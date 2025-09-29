'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import {
  GET_EMPLOYEE_COUNT,
  GET_LEAVE_REQUEST_COUNT,
} from '@/lib/graphql/queries';
import EmployeeList from '@/components/employee-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, Calendar } from 'lucide-react';

interface EmployeeCountResult {
  employeeCount: number;
}
interface LeaveRequestCountResult {
  leaveRequestCount: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { data: employeeCountData } =
    useQuery<EmployeeCountResult>(GET_EMPLOYEE_COUNT);
  const { data: leaveRequestCountData } = useQuery<LeaveRequestCountResult>(
    GET_LEAVE_REQUEST_COUNT
  );

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Check if user is admin
      if (parsedUser.role !== 'ADMIN') {
        router.push('/dashboard');
      }
    } else {
      router.push('/auth/signin');
    }
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/auth/signin');
  };

  if (!user) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center'>
              <Users className='h-8 w-8 text-blue-600 mr-3' />
              <h1 className='text-2xl font-bold text-gray-900'>
                Admin Dashboard
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-700'>
                Welcome, {user.name || user.email}
              </span>
              <Button variant='outline' onClick={handleSignOut}>
                <LogOut className='h-4 w-4 mr-2' />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='space-y-6'>
            {/* Stats Cards */}
            <div className='grid grid-cols-2 gap-6'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Total Employees
                  </CardTitle>
                  <Users className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {employeeCountData?.employeeCount || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    All team members
                  </p>
                </CardContent>
              </Card>

              <Card
                className='cursor-pointer hover:shadow-md transition-shadow'
                onClick={() => router.push('/admin/leave-requests')}
              >
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Leave Requests
                  </CardTitle>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>
                    {leaveRequestCountData?.leaveRequestCount || 0}
                  </div>
                  <p className='text-xs text-muted-foreground'>
                    Total leave requests
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Employee Management */}
            <EmployeeList />
          </div>
        </div>
      </main>
    </div>
  );
}
