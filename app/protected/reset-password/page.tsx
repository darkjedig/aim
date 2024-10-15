'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { FormMessage } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Message {
  message: string;
}

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<Message | null>(null);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const verifyToken = async () => {
      const token = new URL(window.location.href).searchParams.get('token');
      if (token) {
        try {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'recovery'
          });
          if (error) {
            throw error;
          }
          setIsTokenValid(true);
          setMessage({ message: 'You can now reset your password.' });
        } catch (error) {
          console.error('Error verifying token:', error);
          setMessage({ message: 'Invalid or expired reset link. Please try again.' });
          setTimeout(() => router.push('/sign-in'), 3000);
        }
      } else {
        setMessage({ message: 'Invalid reset link. Please try again.' });
        setTimeout(() => router.push('/sign-in'), 3000);
      }
    };

    verifyToken();
  }, [supabase.auth, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!isTokenValid) {
      setMessage({ message: "Invalid reset link. Please request a new password reset." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ message: "Passwords do not match" });
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      setMessage({ message: "Password updated successfully" });
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      console.error('Error resetting password:', error);
      setMessage({ message: "Failed to reset password. Please try again." });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-purple-500 mb-6">Reset Password</h1>
        {message && <FormMessage message={message} />}
        {isTokenValid && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-300">New Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500"
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-gray-300">Confirm New Password</Label>
              <Input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full bg-gray-700 text-white border-gray-600 focus:border-purple-500"
              />
            </div>
            <SubmitButton className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded">
              Reset Password
            </SubmitButton>
          </div>
        )}
      </form>
    </div>
  );
}
