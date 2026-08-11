import type { Metadata } from 'next';
import '../index.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: {
    default: 'Choco Ember - Handmade Chocolates, Visakhapatnam',
    template: '%s | Choco Ember',
  },
  description: 'Handmade artisanal chocolates crafted with care in Visakhapatnam. Fruit-flavoured chocolates and coconut chocolate bars by Choco Ember.',
  keywords: ['Chocolates', 'Handmade', 'Visakhapatnam', 'Artisanal', 'Choco Ember', 'Coconut bars', 'Fruit chocolates'],
  authors: [{ name: 'Choco Ember' }],
  creator: 'Choco Ember',
  publisher: 'Choco Ember',
  icons: {
    icon: '/images/choco_ember_premium_logo_redesign.png',
    apple: '/images/choco_ember_premium_logo_redesign.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Choco Ember',
    title: 'Choco Ember - Handmade Chocolates',
    description: 'Rich, smooth, and memorable handmade chocolates from Visakhapatnam.',
    images: [
      {
        url: '/images/choco_ember_premium_logo_redesign.png',
        width: 1200,
        height: 630,
        alt: 'Choco Ember - Handmade Chocolates',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Choco Ember - Handmade Chocolates',
    description: 'Rich, smooth, and memorable handmade chocolates from Visakhapatnam.',
    images: ['/images/choco_ember_premium_logo_redesign.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Literata:ital,wght@0,300;0,400;0,500;1,400&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
