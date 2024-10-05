'use client';

import { useRouter } from 'next/navigation';
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AnimatedBackgroundSignin } from '@/components/animated-background-signin';
import { useState } from 'react';

export default function Login({ searchParams }: { searchParams: Message }) {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    const result = await signInAction(formData);
    if ('error' in result) {
      setError(result.error as string);
    } else if ('redirectTo' in result) {
      router.push(result.redirectTo);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-12 bg-gray-900">
      <AnimatedBackgroundSignin />
      <div className="relative z-10 w-full max-w-md px-4">
        <form action={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
          <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Sign In
          </h1>
          <div className="mb-6">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</Label>
            <Input name="email" placeholder="you@example.com" required className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500" />
          </div>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</Label>
              <Link className="text-xs text-purple-400 hover:text-purple-300" href="/forgot-password">
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              required
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <SubmitButton pendingText="Signing In..." className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline text-lg">
            Sign in
          </SubmitButton>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          <p className="text-sm text-center mt-6 text-gray-400">
            Don't have an account?{" "}
            <Link className="text-purple-400 hover:text-purple-300 font-medium" href="/sign-up">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}