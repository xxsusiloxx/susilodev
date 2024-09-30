"use client";

import "./globals.css";

import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/modules/Navbar";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <SessionProvider>
          <Navbar />
          <QueryClientProvider client={queryClient}>
            <main className="flex flex-col w-full max-w-[1400px] px-4 lg:px-6 mx-auto">
              {children}
            </main>
          </QueryClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
