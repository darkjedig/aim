"use client"

import React, { ReactNode, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { AnimatedBackground } from "@/components/animated-background";
import { Overview } from './components/Overview';
import { Subscription } from './components/Subscription';
import { Credits } from './components/Credits';
import { ContentLibrary } from './components/ContentLibrary';
import { Tools } from './components/Tools';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "subscription":
        return <Subscription />;
      case "credits":
        return <Credits />;
      case "library":
        return <ContentLibrary />;
      case "tools":
        return <Tools />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <AnimatedBackground />
      <Sidebar setActiveSection={setActiveSection} />
      <main className="flex-1 p-8 overflow-y-auto z-10">
        <h1 className="text-3xl font-bold text-gray-100 mb-8">
          {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
        </h1>
        {renderSection()}
      </main>
    </div>
  );
}
