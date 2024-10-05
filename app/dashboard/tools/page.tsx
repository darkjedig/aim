import React from 'react';
import { Tools } from '../components/Tools';

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Tools</h1>
      <Tools />
    </div>
  );
}