import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from './providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vaultigo',
  description: 'Your digital locker, reimagined',
  icons: {
    icon: '/vaultigo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      data-theme='dark'
      style={{ colorScheme: 'dark' }}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider>
          <Providers>{children}</Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
