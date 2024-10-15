'use client';

import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { AnimatedBackgroundSignup } from '@/components/animated-background-signup';
import { useState } from 'react';

export default function Signup({ searchParams }: { searchParams: Message }) {
  const [message, setMessage] = useState<{ type: 'error' | 'success', content: string } | null>(null);

  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  const handleSubmit = async (formData: FormData) => {
    const result = await signUpAction(formData);
    if ('error' in result) {
      setMessage({ type: 'error', content: result.error ?? 'An error occurred' });
    } else if ('message' in result) {
      setMessage({ type: 'success', content: result.message ?? 'Operation successful' });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-12 bg-gray-900">
      <AnimatedBackgroundSignup />
      <div className="relative z-10 w-full max-w-md px-4">
        <form action={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
          <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Sign Up
          </h1>
          <div className="mb-6">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </Label>
            <Input
              name="email"
              placeholder="you@example.com"
              required
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="mb-6">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              placeholder="Your password"
              minLength={6}
              required
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <SubmitButton
            pendingText="Signing up..."
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline text-lg"
          >
            Sign up
          </SubmitButton>
          {message && (
            <p className={`text-center mt-4 ${message.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
              {message.content}
            </p>
          )}
          <p className="text-sm text-center mt-6 text-gray-400">
            Already have an account?{" "}
            <Link className="text-purple-400 hover:text-purple-300 font-medium" href="/sign-in">
              Sign in
            </Link>
          </p>
        </form>
        <SmtpMessage />
      </div>
    </div>
  );
}
