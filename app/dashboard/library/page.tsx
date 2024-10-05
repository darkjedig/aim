import React from 'react';
import { ContentLibrary } from '../components/ContentLibrary';

export default function LibraryPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Content Library</h1>
      <ContentLibrary />
    </div>
  );
}