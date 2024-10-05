import React, { ReactNode } from "react";
import { Sidebar } from "./components/Sidebar";
import { AnimatedBackground } from "@/components/animated-background";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-300">
      <AnimatedBackground />
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto z-10">
        {children}
      </main>
    </div>
  );
}
