import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, PenTool, BarChart, Zap, Database, Share2, FileText, Image as ImageIcon, Maximize } from "lucide-react";

export function Tools() {
  const toolCards = [
    { icon: Search, title: "SEO Topic Finder", credits: 10 },
    { icon: PenTool, title: "AI Content Writer", credits: 20 },
    { icon: BarChart, title: "Strategy Builder", credits: 15 },
    { icon: Zap, title: "Outrank", credits: 25 },
    { icon: Database, title: "Internal Link Optimizer", credits: 15 },
    { icon: Share2, title: "Social Media Manager", credits: 10 },
    { icon: FileText, title: "Ad Copy Generator", credits: 5 },
    { icon: ImageIcon, title: "AI Image Generator", credits: 30 },
    { icon: Maximize, title: "Image Upscaler", credits: 5 },
  ];

  return (
    <Card className="bg-gray-800 border-0 shadow-lg shadow-purple-500/10">
      <CardHeader>
        <CardTitle className="text-gray-100">Quick Access to Tools</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {toolCards.map((tool, index) => (
            <Card key={index} className="bg-gray-700 border-0 shadow-md shadow-purple-500/5 hover:shadow-lg hover:shadow-purple-500/10 transition-shadow">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <tool.icon className="h-8 w-8 text-purple-500 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-200">{tool.title}</h3>
                    <p className="text-sm text-gray-400">{tool.credits} credits per use</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-purple-500 hover:text-white">Use Tool</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
