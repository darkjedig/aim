import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Subscription() {
  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-gray-100">Subscription Details</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-300">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Current Plan:</span>
            <span>Pro</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Status:</span>
            <span className="text-green-500">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Renewal Date:</span>
            <span>October 1, 2023</span>
          </div>
        </div>
        <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">Upgrade Plan</Button>
      </CardContent>
    </Card>
  );
}
