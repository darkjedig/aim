import React from 'react';
import { Credits } from '../components/Credits';

export default function CreditsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Credits</h1>
      <Credits />
    </div>
  );
}