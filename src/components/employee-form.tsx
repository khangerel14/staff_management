'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@apollo/client/react';
import { CREATE_EMPLOYEE, UPDATE_EMPLOYEE } from '@/lib/graphql/mutations';
import { GET_EMPLOYEES } from '@/lib/graphql/queries';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  type CreateEmployeeFormData,
  type UpdateEmployeeFormData,
} from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

// Use the validation schemas from validations.ts

interface Employee {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  role?: string;
}

interface EmployeeFormProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly employee?: Employee;
  readonly isEdit?: boolean;
}

export default function EmployeeForm({
  isOpen,
  onClose,
  employee,
  isEdit = false,
}: EmployeeFormProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateEmployeeFormData | UpdateEmployeeFormData>({
    resolver: zodResolver(isEdit ? updateEmployeeSchema : createEmployeeSchema),
  });

  const [createEmployee] = useMutation(CREATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: () => {
      reset();
      onClose();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const [updateEmployee] = useMutation(UPDATE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES }],
    onCompleted: () => {
      reset();
      onClose();
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  useEffect(() => {
    if (isEdit && employee) {
      setValue('id', employee.id);
      setValue('name', employee.name);
      setValue('email', employee.email);
      setValue('phoneNumber', employee.phoneNumber || '');
      setValue('address', employee.address || '');
      setValue(
        'birthDate',
        employee.birthDate ? employee.birthDate.split('T')[0] : ''
      );
      // Fix gender assignment to enum
      const gender = ['MALE', 'FEMALE', 'OTHER'].includes(employee.gender || '')
        ? (employee.gender as 'MALE' | 'FEMALE' | 'OTHER')
        : undefined;
      setValue('gender', gender);
      setValue('role', employee.role as 'ADMIN' | 'EMPLOYEE'); // <-- Add this line
    } else {
      reset();
    }
  }, [isEdit, employee, setValue, reset, isOpen]);

  const handleCreateEmployee = async (data: CreateEmployeeFormData) => {
    await createEmployee({
      variables: {
        input: {
          ...data,
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString()
            : undefined,
        },
      },
    });
  };

  const handleUpdateEmployee = async (data: UpdateEmployeeFormData) => {
    if (!employee) return;
    console.log('Update data:', data, employee); // <--- Add this

    const { id, ...rest } = data;
    await updateEmployee({
      variables: {
        input: {
          id: employee.id,
          ...rest,
          birthDate: data.birthDate
            ? new Date(data.birthDate).toISOString()
            : undefined,
        },
      },
    });
  };

  const onSubmit = async (
    data: CreateEmployeeFormData | UpdateEmployeeFormData
  ) => {
    console.log('onSubmit', { isEdit, employee, data });
    setError('');
    setLoading(true);
    try {
      if (isEdit && employee) {
        await handleUpdateEmployee(data as UpdateEmployeeFormData);
      } else {
        await handleCreateEmployee(data as CreateEmployeeFormData);
      }
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
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Employee' : 'Add New Employee'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update employee information below.'
              : 'Fill in the employee details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' {...register('name')} placeholder='Full name' />
            {errors.name && (
              <p className='text-sm text-red-600'>{errors.name.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              {...register('email')}
              placeholder='Email address'
            />
            {errors.email && (
              <p className='text-sm text-red-600'>{errors.email.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phoneNumber'>Phone Number</Label>
            <Input
              id='phoneNumber'
              type='tel'
              {...register('phoneNumber')}
              placeholder='Phone number'
            />
            {errors.phoneNumber && (
              <p className='text-sm text-red-600'>
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='address'>Address</Label>
            <Input
              id='address'
              {...register('address')}
              placeholder='Address'
            />
            {errors.address && (
              <p className='text-sm text-red-600'>{errors.address.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='birthDate'>Birth Date</Label>
            <Input id='birthDate' type='date' {...register('birthDate')} />
            {errors.birthDate && (
              <p className='text-sm text-red-600'>{errors.birthDate.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='gender'>Gender</Label>
            <Select
              value={watch('gender')}
              onValueChange={(value) =>
                setValue('gender', value as 'MALE' | 'FEMALE' | 'OTHER')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='MALE'>Male</SelectItem>
                <SelectItem value='FEMALE'>Female</SelectItem>
                <SelectItem value='OTHER'>Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className='text-sm text-red-600'>{errors.gender.message}</p>
            )}
          </div>

          {!isEdit && (
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                {...register('password')}
                placeholder='Password'
              />
              {'password' in errors && errors.password && (
                <p className='text-sm text-red-600'>
                  {errors.password.message}
                </p>
              )}
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='role'>Role</Label>
            <Select
              value={watch('role')}
              onValueChange={(value) =>
                setValue('role', value as 'ADMIN' | 'EMPLOYEE')
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Select role' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ADMIN'>Admin</SelectItem>
                <SelectItem value='EMPLOYEE'>Employee</SelectItem>
              </SelectContent>
            </Select>
            {'role' in errors && errors.role && (
              <p className='text-sm text-red-600'>{errors.role.message}</p>
            )}
          </div>

          {error && <div className='text-red-600 text-sm'>{error}</div>}

          <DialogFooter>
            <Button type='button' variant='outline' onClick={handleClose}>
              Cancel
            </Button>
            <Button type='submit' disabled={loading}>
              {(() => {
                if (loading) return 'Saving...';
                return isEdit ? 'Update' : 'Create';
              })()}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
