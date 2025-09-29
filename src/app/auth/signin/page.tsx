'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SIGN_IN } from '@/lib/graphql/mutations';
import { signInSchema, type SignInFormData } from '@/lib/validations';
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

interface SignInMutationResult {
  signIn: {
    token: string | null;
    user: {
      id: string;
      email: string;
      role: string;
      createdAt: string;
      updatedAt: string;
      __typename?: string;
    } | null;
    success: boolean;
    message: string;
    __typename?: string;
  };
}

export default function SignInPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const [signIn] = useMutation<SignInMutationResult>(SIGN_IN);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (requestData: SignInFormData) => {
    console.log('log');
    setError('');

    try {
      const { data } = await signIn({
        variables: {
          input: { email: requestData.email, password: requestData.password },
        },
      });

      console.log(data);
      if (data?.signIn.success) {
        // Store user data in localStorage
        if (data.signIn.token && data.signIn.user) {
          localStorage.setItem('token', data.signIn.token);
          localStorage.setItem('user', JSON.stringify(data.signIn.user));
        }
        router.push('/dashboard');
      } else {
        setError(data?.signIn.message || 'An error occurred during sign in');
        console.log(data?.signIn.message);
      }
    } catch (err: unknown) {
      console.log('inside catch', err); // <--- Add this

      if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof (err as { message?: unknown }).message === 'string'
      ) {
        setError((err as { message: string }).message);
      } else {
        setError('An error occurred during sign in');
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Sign In
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='Enter your email'
                {...register('email')}
              />
              {errors.email && (
                <p className='text-red-600 text-sm'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                {...register('password')}
              />
              {errors.password && (
                <p className='text-red-600 text-sm'>
                  {errors.password.message}
                </p>
              )}
            </div>
            {error && (
              <div className='text-red-600 text-sm text-center'>{error}</div>
            )}
            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className='mt-4 text-center space-y-2'>
            <Link
              href='/auth/forgot-password'
              className='text-sm text-blue-600 hover:underline'
            >
              Forgot your password?
            </Link>
            <div className='text-sm text-gray-600'>
              Don&apos;t have an account?{' '}
              <Link
                href='/auth/signup'
                className='text-blue-600 hover:underline'
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
