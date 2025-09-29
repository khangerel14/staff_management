'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CREATE_LEAVE_REQUEST } from '@/lib/graphql/mutations';
import {
  leaveRequestSchema,
  type LeaveRequestFormData,
} from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LeaveRequestFormProps {
  employeeId: string;
  onSuccess?: () => void;
}

export default function LeaveRequestForm({
  employeeId,
  onSuccess,
}: LeaveRequestFormProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [createLeaveRequest] = useMutation(CREATE_LEAVE_REQUEST);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeaveRequestFormData>({
    resolver: zodResolver(leaveRequestSchema),
  });

  const onSubmit = async (data: LeaveRequestFormData) => {
    setError('');
    setMessage('');

    try {
      await createLeaveRequest({
        variables: {
          input: {
            employeeId,
            startDate: new Date(data.startDate).toISOString(),
            endDate: new Date(data.endDate).toISOString(),
            description: data.description,
          },
        },
      });

      setMessage('Leave request submitted successfully!');
      reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while submitting leave request'
      );
    }
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl font-bold text-center'>
          Request Leave of Absence
        </CardTitle>
        <CardDescription className='text-center'>
          Submit your leave request for admin approval
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='startDate'>Start Date</Label>
            <Input id='startDate' type='date' {...register('startDate')} />
            {errors.startDate && (
              <p className='text-red-600 text-sm'>{errors.startDate.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='endDate'>End Date</Label>
            <Input id='endDate' type='date' {...register('endDate')} />
            {errors.endDate && (
              <p className='text-red-600 text-sm'>{errors.endDate.message}</p>
            )}
          </div>
          <div className='space-y-2'>
            <Label htmlFor='description'>Description</Label>
            <textarea
              id='description'
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              rows={4}
              placeholder='Please provide a reason for your leave request...'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-red-600 text-sm'>
                {errors.description.message}
              </p>
            )}
          </div>
          {error && (
            <div className='text-red-600 text-sm text-center'>{error}</div>
          )}
          {message && (
            <div className='text-green-600 text-sm text-center'>{message}</div>
          )}
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
