import React from 'react';
import { Overview } from './components/Overview';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Dashboard</h1>
      <Overview />
    </div>
  );
}
