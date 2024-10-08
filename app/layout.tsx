import { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/app/globals.css";
import { ToastProvider } from "@/components/ui/toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow w-full max-w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}