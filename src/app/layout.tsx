import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://rabbitry.ng'),
  title: {
    default: 'RABBITRY | Premium Rabbits, Meat & Farm Inputs — Ile-Ife, Nigeria',
    template: '%s | RABBITRY',
  },
  description:
    'Nigeria\'s premier rabbit farm. Buy live breeding stock, fresh processed meat, event catering, organic farm inputs, and custom cages. Based in Ile-Ife, Osun State. Nationwide delivery.',
  keywords: [
    'rabbit farm Nigeria', 'buy rabbits Ile-Ife', 'rabbit meat Nigeria',
    'rabbit farming Osun State', 'organic rabbit urine fertilizer Nigeria',
    'rabbit cages Nigeria', 'rabbit catering Nigeria', 'Danethicals Limited',
  ],
  authors: [{ name: 'Danethicals Limited' }],
  creator: 'Danethicals Limited',
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://rabbitry.ng',
    siteName: 'RABBITRY',
    title: 'RABBITRY | Premium Rabbits, Meat & Farm Inputs — Nigeria',
    description: 'Full-cycle commercial rabbit business — live stock, processed meat, catering, organic inputs, and cage fabrication. Nationwide delivery from Ile-Ife.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'RABBITRY Farm — Ile-Ife Nigeria' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Rabbitryrabbit',
    creator: '@Rabbitryrabbit',
    title: 'RABBITRY | Premium Rabbits & Farm Produce — Nigeria',
    description: 'Buy live rabbits, fresh meat, organic fertilizer, event catering & custom cages. Nationwide delivery.',
    images: ['/og-image.jpg'],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RABBITRY',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: '#1a5c2a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
