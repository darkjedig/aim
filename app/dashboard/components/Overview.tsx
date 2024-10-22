"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

interface UserData {
  email: string;
  created_at: string;
  name: string;
  status: string;
  credits: number;
  subscription: string;
}

export function Overview() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const supabase = createClient();
  const { toast } = useToast();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;

      if (authUser) {
        const { data: publicUser, error: publicError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', authUser.id)
          .single();

        if (publicError) throw publicError;

        setUser({
          ...publicUser,
          email: authUser.email || '',
          created_at: authUser.created_at || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  }

  const handleRequestPasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user?.email || '');

      if (error) throw error;

      setSuccessMessage("Password reset email sent. Please check your inbox for further instructions.");
      setIsResetPasswordDialogOpen(false);
    } catch (error) {
      console.error('Error requesting password reset:', error);
      setErrorMessage("Failed to send password reset email. Please try again.");
    }
  };

  const handleUpdateProfile = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("Please enter your current password");
      return;
    }

    try {
      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setErrorMessage("Current password is incorrect");
        return;
      }

      if (newEmail && newEmail !== user?.email) {
        const { data, error: updateAuthError } = await supabase.auth.updateUser({ 
          email: newEmail,
        });
        if (updateAuthError) throw updateAuthError;

        if (data.user?.new_email) {
          setSuccessMessage("Please check your new email for a confirmation link.");
        } else {
          setSuccessMessage("Your email has been updated successfully.");
        }
      }

      setIsEditDialogOpen(false);
      await getUser(); // Refresh user data
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage("Failed to update profile. Please try again.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <>
      {successMessage && (
        <Alert className="mb-4 bg-green-500">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-gray-100">User Account Overview</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Email:</span>
              <span>{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Account Created:</span>
              <span>{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span>{user?.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Credits:</span>
              <span>{user?.credits}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Subscription:</span>
              <span>{user?.subscription}</span>
            </div>
          </div>
          <div className="mt-4 space-x-2">
            <Button 
              className="bg-purple-500 hover:bg-purple-600 text-white" 
              onClick={() => setIsEditDialogOpen(true)}
            >
              Update Email
            </Button>
            <Button 
              className="bg-purple-500 hover:bg-purple-600 text-white" 
              onClick={() => setIsResetPasswordDialogOpen(true)}
            >
              Request Password Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog 
        open={isEditDialogOpen} 
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setErrorMessage(null);
            setNewEmail('');
            setCurrentPassword('');
          }
        }}
      >
        <DialogContent className="bg-gray-800 text-gray-300">
          <DialogHeader>
            <DialogTitle>Update Email</DialogTitle>
            <DialogDescription>
              Enter your current password and new email address.
            </DialogDescription>
          </DialogHeader>
          {errorMessage && (
            <Alert className="mb-4 bg-red-500">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="bg-gray-700 text-gray-300 border-gray-600"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">New Email</Label>
              <Input
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="bg-gray-700 text-gray-300 border-gray-600"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="text-gray-800 border-gray-600 hover:bg-gray-300">
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile} className="bg-purple-500 hover:bg-purple-600 text-white">
              Update Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog 
        open={isResetPasswordDialogOpen} 
        onOpenChange={setIsResetPasswordDialogOpen}
      >
        <DialogContent className="bg-gray-800 text-gray-300">
          <DialogHeader>
            <DialogTitle>Request Password Reset</DialogTitle>
            <DialogDescription>
              Click the button below to receive a password reset email.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordDialogOpen(false)} className="text-gray-800 border-gray-600 hover:bg-gray-300">
              Cancel
            </Button>
            <Button onClick={handleRequestPasswordReset} className="bg-purple-500 hover:bg-purple-600 text-white">
              Send Reset Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
