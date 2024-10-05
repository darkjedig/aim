"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Overview() {
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    getUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-gray-100">User Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Account Created:</span>
            <span>{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </div>
        <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">Update Profile</Button>
      </CardContent>
    </Card>
  );
}
