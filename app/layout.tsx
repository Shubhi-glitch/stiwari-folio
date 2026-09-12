import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Suspense } from 'react'
import './globals.css'
import { profile } from '@/lib/site-data'
import { SiteShell } from '@/components/site-shell'

const _geistSans = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

const fullName = `${profile.firstName} ${profile.lastName}`

export const metadata: Metadata = {
  title: {
    default: `${fullName} — ${profile.roles[0]}`,
    template: `%s — ${fullName}`,
  },
  description: profile.tagline,
  generator: 'v0.app',
  keywords: [
    'AI engineer',
    'machine learning',
    'data analyst',
    'business analyst',
    'web developer',
    'portfolio',
    fullName,
  ],
  openGraph: {
    title: `${fullName} — ${profile.roles.join(' / ')}`,
    description: profile.tagline,
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#100f18',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="bg-background text-foreground font-sans antialiased">
        <Suspense fallback={null}>
          <SiteShell>{children}</SiteShell>
        </Suspense>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
