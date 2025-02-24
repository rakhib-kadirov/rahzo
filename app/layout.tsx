// 'use client'

import '@/app/ui/global.css'
import { inter, plusJakarta } from '@/app/ui/fonts'
import { Metadata } from 'next'
import QueryProvider from './QueryProvider'
import React from 'react'
import SessionProvider from './ui/SessionProvider'

export const metadata: Metadata = {
  title: {
    template: '%s | RAHZO',
    default: 'RAHZO'
  },
  description: 'The Social Network.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh')
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <React.StrictMode>
        <QueryProvider>
          <SessionProvider>
            <body className={`${plusJakarta.className} antialiased`}>
              {children}
            </body>
          </SessionProvider>
        </QueryProvider>
      </React.StrictMode>
    </html>
  );
}
