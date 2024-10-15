'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { AnimatedBackgroundForgotPassword } from '@/components/animated-background-forgot-password';

export default function ForgotPassword({
  searchParams,
}: {
  searchParams: Message;
}) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      setMessage({ message: error.message });
    } else {
      setMessage({ message: 'Check your email for the password reset link' });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen py-12 bg-gray-900">
      <AnimatedBackgroundForgotPassword />
      <div className="relative z-10 w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="bg-gray-800/80 backdrop-blur-sm shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
          <h1 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Reset Password
          </h1>
          <div className="mb-6">
            <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</Label>
            <Input 
              name="email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" 
              required 
              className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500 focus:ring-purple-500" 
            />
          </div>
          <SubmitButton className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline text-lg">
            Reset Password
          </SubmitButton>
          {message && <FormMessage message={message} />}
          <p className="text-sm text-center mt-6 text-gray-400">
            Remember your password?{" "}
            <Link className="text-purple-400 hover:text-purple-300 font-medium" href="/sign-in">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
