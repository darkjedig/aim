import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";

export function ContentLibrary() {
  const contentItems = [
    { title: "Top 10 AI Marketing Trends", type: "SEO Topic", date: "2023-09-28" },
    { title: "How AI is Revolutionizing Content Creation", type: "Blog Post", date: "2023-09-27" },
    { title: "Boost Your ROI with AI-Powered Marketing", type: "Ad Copy", date: "2023-09-26" },
  ];

  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-gray-100">Content Generation Library</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input type="text" placeholder="Search content..." className="w-64 bg-gray-700 text-gray-300 border-gray-600" />
          <select className="bg-gray-700 text-gray-300 rounded p-2 border border-gray-600">
            <option>All Types</option>
            <option>SEO Topics</option>
            <option>Blog Posts</option>
            <option>Ad Copy</option>
            <option>Images</option>
          </select>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-400">
              <th className="pb-2">Title</th>
              <th className="pb-2">Type</th>
              <th className="pb-2">Date</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            {contentItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700 transition-colors">
                <td className="py-2">{item.title}</td>
                <td>{item.type}</td>
                <td>{item.date}</td>
                <td>
                  <Button variant="ghost" size="sm" className="hover:bg-purple-500 hover:text-white mr-2">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm" className="hover:bg-red-500 hover:text-white">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
