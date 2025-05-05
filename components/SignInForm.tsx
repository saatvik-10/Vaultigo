'use client';

import { useForm } from 'react-hook-form';
import { useSignIn } from '@clerk/nextjs';
import { signInSchema } from '@/schemas/signInSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Card, CardBody, CardHeader, CardFooter } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function SignInForm() {
  const route = useRouter();

  const { signIn, isLoaded, setActive } = useSignIn();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const res = await signIn.create({
        identifier: data.identifier,
        password: data.password,
      });
      if (res.status === 'complete') {
        setActive({ session: res.createdSessionId });
        route.push('/dashboard');
      } else {
        setAuthError('Invalid credentials');
      }
    } catch (err: any) {
      setAuthError(
        err.errors?.[0]?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-full max-w-md border border-pink bg-slate-50 shadow-xl'>
      <CardHeader className='flex flex-col gap-1 items-center pb-2'>
        <h1 className='text-2xl font-bold text-blue'>Welcome Back</h1>
        <p className='text-pink/70 text-center'>
          Sign in to access your secure cloud storage
        </p>
      </CardHeader>

      <Divider />

      <CardBody className='py-6'>
        {authError && (
          <div className='bg-danger-50 text-danger-700 p-4 rounded-lg mb-6 flex items-center gap-2'>
            <AlertCircle className='h-5 w-5 flex-shrink-0' />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <label
              htmlFor='identifier'
              className='text-sm font-medium text-blue'
            >
              Email
            </label>
            <Input
              id='identifier'
              type='email'
              placeholder='your.email@example.com'
              className='w-full px-2 text-blue'
              variant='underlined'
              color='primary'
              startContent={<Mail className='h-4 w-4 text-pink' />}
              isInvalid={!!errors.identifier}
              errorMessage={errors.identifier?.message}
              {...register('identifier')}
            />
          </div>

          <div className='space-y-2'>
            <div className='flex justify-between items-center'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-blue'
              >
                Password
              </label>
            </div>
            <Input
              id='password'
              type={showPassword ? 'text' : 'password'}
              placeholder='••••••••'
              startContent={<Lock className='h-4 w-4 text-pink' />}
              endContent={
                <Button
                  isIconOnly
                  variant='light'
                  size='sm'
                  onPress={() => setShowPassword(!showPassword)}
                  type='button'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4 text-pink' />
                  ) : (
                    <Eye className='h-4 w-4 text-pink' />
                  )}
                </Button>
              }
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              {...register('password')}
              className='w-full px-2 text-blue'
              variant='underlined'
              color='primary'
            />
          </div>

          <Button
            type='submit'
            color='primary'
            className='w-full'
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </CardBody>

      <Divider />

      <CardFooter className='flex justify-center py-4'>
        <p className='text-sm text-default-500'>
          Don't have an account?{' '}
          <Link
            href='/sign-up'
            className='text-pink hover:underline font-medium'
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
