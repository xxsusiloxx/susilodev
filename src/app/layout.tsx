'use client';

import './globals.css';
import { Navbar } from '@/components/modules/Navbar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="mx-auto flex w-full max-w-[1400px] flex-col px-4 lg:px-6">{children}</main>
      </body>
    </html>
  );
}
