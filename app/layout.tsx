import type { Metadata } from 'next';
import { Inter, Syne, Cinzel, Caveat } from 'next/font/google';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  display: 'swap',
});

const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'HackerHouse Goa 2026 — Builder Card Generator',
  description: 'Create your HackerHouse Goa 2026 Builder Card / PFP Frame and share your vibe with #FrameInGoa.',
  openGraph: {
    title: 'HackerHouse Goa 2026 — Builder Card Generator',
    description: 'Create your HackerHouse Goa 2026 Builder Card / PFP Frame and share your vibe with #FrameInGoa.',
    url: 'https://hackerhouse-goa-2026.vercel.app',
    siteName: 'HackerHouse Goa 2026',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HackerHouse Goa 2026 — Builder Card Generator',
    description: 'Create your HackerHouse Goa 2026 Builder Card / PFP Frame and share your vibe with #FrameInGoa.',
    creator: '@HackerHouseGoa',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${cinzel.variable} ${caveat.variable} h-full antialiased`}
      data-theme="goa"
    >
      <body className="min-h-full flex flex-col font-sans select-none overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
