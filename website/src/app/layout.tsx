import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-sans-serif'
});

export const metadata: Metadata = {
  title: 'Bucket Store',
  description: 'Created by Bo Bramer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(nunito.className, 'h-screen bg-background antialiased')}>
        {children}
      </body>
    </html>
  )
}
