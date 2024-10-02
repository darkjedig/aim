import { ReactNode } from "react";
import { createClient } from "@/utils/supabase/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/app/globals.css";

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = createClient();

  let session = null;
  try {
    const { data } = await supabase.auth.getSession();
    session = data.session;
  } catch (error) {
    console.error("Error fetching session:", error);
  }

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