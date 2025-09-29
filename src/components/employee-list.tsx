'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_EMPLOYEES } from '@/lib/graphql/queries';
import { DELETE_EMPLOYEE } from '@/lib/graphql/mutations';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import EmployeeForm from './employee-form';
import { Trash2, Edit, Plus } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export default function EmployeeList() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [error, setError] = useState('');

  const {
    data,
    loading,
    error: queryError,
  } = useQuery<{ employees: Employee[] }>(GET_EMPLOYEES);
  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      setSelectedEmployee(null);
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
    console.log(employee);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedEmployee) {
      try {
        await deleteEmployee({
          variables: { id: selectedEmployee.id },
        });
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'message' in err &&
          typeof (err as { message?: unknown }).message === 'string'
        ) {
          setError((err as { message: string }).message);
        } else {
          setError('An error occurred');
        }
      }
    }
  };

  const getInitials = (name: string) =>
    name
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

  if (loading) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center'>Loading employees...</div>
        </CardContent>
      </Card>
    );
  }

  if (queryError) {
    return (
      <Card>
        <CardContent className='p-6'>
          <div className='text-center text-red-600'>
            Error loading employees: {queryError.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const employees = data?.employees || [];

  return (
    <>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>Manage your team members</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className='h-4 w-4 mr-2' />
            Add Employee
          </Button>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className='text-center py-8 text-gray-500'>
              No employees found. Add your first employee to get started.
            </div>
          ) : (
            <div className='space-y-4'>
              {employees.map((employee: Employee) => (
                <div
                  key={employee.id}
                  className='flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50'
                >
                  <div className='flex items-center space-x-4'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
                        <span className='text-sm font-medium text-gray-700'>
                          {getInitials(employee.name)}
                        </span>
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center space-x-2'>
                        <p className='text-sm font-medium text-gray-900 truncate'>
                          {employee.name}
                        </p>
                      </div>
                      <p className='text-sm text-gray-500 truncate'>
                        {employee.email}
                      </p>
                      {employee.phoneNumber && (
                        <p className='text-sm text-gray-500 truncate'>
                          📞 {employee.phoneNumber}
                        </p>
                      )}
                      {employee.address && (
                        <p className='text-sm text-gray-500 truncate'>
                          📍 {employee.address}
                        </p>
                      )}
                      {employee.birthDate && (
                        <p className='text-sm text-gray-500 truncate'>
                          🎂 {new Date(employee.birthDate).toLocaleDateString()}
                        </p>
                      )}
                      {employee.gender && (
                        <p className='text-sm text-gray-500 truncate'>
                          👤 {employee.gender}
                        </p>
                      )}
                      {employee.role && (
                        <p className='text-sm text-gray-500 truncate'>
                          🏷️ {employee.role}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEdit(employee)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleDelete(employee)}
                      className='text-red-600 hover:text-red-700'
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Employee Dialog */}
      <EmployeeForm
        key='new'
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        isEdit={false}
      />

      {/* Edit Employee Dialog */}
      <EmployeeForm
        key={isEditDialogOpen ? selectedEmployee?.id || 'edit' : 'closed'}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        employee={selectedEmployee ?? undefined}
        isEdit={true}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedEmployee?.name}? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant='destructive' onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
