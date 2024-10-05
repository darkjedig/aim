import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Credits() {
  return (
    <div className="space-y-4">
      <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
        <CardHeader>
          <CardTitle className="text-gray-100">Credit System</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Remaining Credits:</span>
              <span>500</span>
            </div>
          </div>
          <Button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white">Purchase Credits</Button>
        </CardContent>
      </Card>
      <Card className="bg-gray-800 border-0 shadow-lg shadow-pink-500/10">
        <CardHeader>
          <CardTitle className="text-gray-100">Credit Usage History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-gray-300">
            <li className="flex justify-between">
              <span>SEO Topic Generation</span>
              <span>-10 credits</span>
            </li>
            <li className="flex justify-between">
              <span>Blog Post Writing</span>
              <span>-20 credits</span>
            </li>
            <li className="flex justify-between">
              <span>Ad Copy Creation</span>
              <span>-5 credits</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
