'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SIGN_UP } from '@/lib/graphql/mutations';
import { signUpSchema, type SignUpFormData } from '@/lib/validations';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';

// Define the type for the signUp mutation result
interface SignUpMutationResult {
  signUp: {
    token: string | null;
    user: {
      id: string;
      email: string;
      role: string;
      createdAt: string;
      updatedAt: string;
    } | null;
    success: boolean;
    message: string;
  };
}

export default function SignUpPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const [signUp] = useMutation<SignUpMutationResult>(SIGN_UP);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setError('');

    try {
      const { data: result } = await signUp({
        variables: {
          input: {
            name: data.name,
            email: data.email,
            password: data.password,
            phoneNumber: data.phoneNumber || undefined,
            address: data.address || undefined,
            birthDate: data.birthDate || undefined,
            gender: data.gender || undefined,
          },
        },
      });

      if (result?.signUp.success) {
        // Store user data in localStorage
        if (result.signUp.token && result.signUp.user) {
          localStorage.setItem('token', result.signUp.token);
          localStorage.setItem('user', JSON.stringify(result.signUp.user));
        }
        router.push('/dashboard');
      } else {
        setError(result?.signUp.message || 'An error occurred during sign up');
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
        setError('An error occurred during sign up');
      }
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Sign Up
          </CardTitle>
          <CardDescription className='text-center'>
            Create your account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='name'>Full Name</Label>
              <Input
                id='name'
                placeholder='Enter your full name'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-red-600 text-sm'>{errors.name.message}</p>
              )}
            </div>
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
              <Label htmlFor='phoneNumber'>Phone Number</Label>
              <Input
                id='phoneNumber'
                type='tel'
                placeholder='Enter your phone number'
                {...register('phoneNumber')}
              />
              {errors.phoneNumber && (
                <p className='text-red-600 text-sm'>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='address'>Address</Label>
              <Input
                id='address'
                placeholder='Enter your address'
                {...register('address')}
              />
              {errors.address && (
                <p className='text-red-600 text-sm'>{errors.address.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='birthDate'>Date of Birth</Label>
              <Input id='birthDate' type='date' {...register('birthDate')} />
              {errors.birthDate && (
                <p className='text-red-600 text-sm'>
                  {errors.birthDate.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='gender'>Gender</Label>
              <Select
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
                <p className='text-red-600 text-sm'>{errors.gender.message}</p>
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
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
          <div className='mt-4 text-center'>
            <div className='text-sm text-gray-600'>
              Already have an account?{' '}
              <Link
                href='/auth/signin'
                className='text-blue-600 hover:underline'
              >
                Sign in
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
