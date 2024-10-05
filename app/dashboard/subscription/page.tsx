import React from 'react';
import { Subscription } from '../components/Subscription';

export default function SubscriptionPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-100 mb-8">Subscription</h1>
      <Subscription />
    </div>
  );
}