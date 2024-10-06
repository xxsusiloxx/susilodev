"use client";

import "./globals.css";
import { Navbar } from "@/components/modules/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Navbar />
        <main className="flex flex-col w-full max-w-[1400px] px-4 lg:px-6 mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
