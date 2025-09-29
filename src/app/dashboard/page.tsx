'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client/react';
import { GET_EMPLOYEE } from '@/lib/graphql/queries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogOut, User, Calendar, Clock } from 'lucide-react';
import EmployeeForm from '@/components/employee-form';

interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface GetEmployeeQueryResult {
  employee: Employee;
}

export default function Dashboard() {
  const [user, setUser] = useState<Employee | null>(null);
  const router = useRouter();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Fetch complete employee data for display and edit dialog
  const { data: employeeData } = useQuery<GetEmployeeQueryResult>(
    GET_EMPLOYEE,
    {
      variables: { id: user?.id },
      skip: !user?.id, // Fetch when user is available
    }
  );

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Redirect admin to admin dashboard
      if (parsedUser.role === 'ADMIN') {
        router.push('/admin');
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
              <User className='h-8 w-8 text-blue-600 mr-3' />
              <h1 className='text-2xl font-bold text-gray-900'>
                Employee Dashboard
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
              {/* Show Edit Profile button only for EMPLOYEE (case-insensitive) */}
              {user.role?.toUpperCase() === 'EMPLOYEE' && (
                <Button
                  variant='default'
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='space-y-6'>
            {/* Welcome Card */}
            <Card>
              <CardHeader>
                <CardTitle>Welcome to your dashboard</CardTitle>
                <CardDescription>
                  Manage your profile and view your information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <h3 className='text-lg font-medium mb-2'>
                      Personal Information
                    </h3>
                    <div className='space-y-2 text-sm'>
                      <p>
                        <span className='font-medium'>Name:</span>{' '}
                        {employeeData?.employee?.name ||
                          user.name ||
                          'Not provided'}
                      </p>
                      <p>
                        <span className='font-medium'>Email:</span>{' '}
                        {employeeData?.employee?.email || user.email}
                      </p>
                      <p>
                        <span className='font-medium'>Phone:</span>{' '}
                        {employeeData?.employee?.phoneNumber || 'Not provided'}
                      </p>
                      <p>
                        <span className='font-medium'>Address:</span>{' '}
                        {employeeData?.employee?.address || 'Not provided'}
                      </p>
                      <p>
                        <span className='font-medium'>Birth Date:</span>{' '}
                        {employeeData?.employee?.birthDate
                          ? new Date(
                              employeeData.employee.birthDate
                            ).toLocaleDateString()
                          : 'Not provided'}
                      </p>
                      <p>
                        <span className='font-medium'>Gender:</span>{' '}
                        {employeeData?.employee?.gender || 'Not provided'}
                      </p>
                      <p>
                        <span className='font-medium'>Role:</span>{' '}
                        {employeeData?.employee?.role || user.role}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h3 className='text-lg font-medium mb-2'>
                      Account Information
                    </h3>
                    <div className='space-y-2 text-sm'>
                      <p>
                        <span className='font-medium'>User ID:</span> {user.id}
                      </p>
                      <p>
                        <span className='font-medium'>Member Since:</span>{' '}
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className='grid grid-cols-1 gap-6'>
              <Card
                className='cursor-pointer hover:shadow-md transition-shadow'
                onClick={() => router.push('/leave-request')}
              >
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    Leave Requests
                  </CardTitle>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>Available</div>
                  <p className='text-xs text-muted-foreground'>
                    Submit and manage your leave requests
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      {/* Employee self-edit dialog */}
      {user.role?.toUpperCase() === 'EMPLOYEE' && (
        <EmployeeForm
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          employee={employeeData?.employee || user}
          isEdit={true}
        />
      )}
    </div>
  );
}
