'use client';

import './globals.css';

import { Inter } from 'next/font/google';

const InterFont = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={InterFont.className}>
        <main className="mx-auto flex w-full max-w-[1100px] flex-col px-4 lg:px-6">{children}</main>
      </body>
    </html>
  );
}
