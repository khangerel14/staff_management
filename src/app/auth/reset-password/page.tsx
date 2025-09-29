'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RESET_PASSWORD } from '@/lib/graphql/mutations';
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
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
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  const [resetPassword] = useMutation(RESET_PASSWORD);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      setValue('token', tokenParam);
    } else {
      setError('Invalid or missing reset token');
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError('');
    setMessage('');

    try {
      await resetPassword({
        variables: {
          input: {
            token: data.token,
            password: data.password,
          },
        },
      });

      setMessage(
        'Password reset successfully! You can now sign in with your new password.'
      );
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'An error occurred while resetting password'
      );
    }
  };

  if (!token && !error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Reset Password
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password'>New Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your new password'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-red-600 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='confirmPassword'>Confirm New Password</Label>
              <Input
                id='confirmPassword'
                type='password'
                placeholder='Confirm your new password'
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className='text-red-600 text-sm'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            {error && (
              <div className='text-red-600 text-sm text-center'>{error}</div>
            )}
            {message && (
              <div className='text-green-600 text-sm text-center'>
                {message}
              </div>
            )}
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
          <div className='mt-4 text-center'>
            <Link
              href='/auth/signin'
              className='text-sm text-blue-600 hover:underline'
            >
              Back to Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
