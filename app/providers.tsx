'use client';

import type { ThemeProviderProps } from 'next-themes';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ImageKitProvider } from 'imagekitio-next';
import { HeroUIProvider } from '@heroui/react';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProp?: ThemeProviderProps;
}

const authenticator = async () => {
  try {
    const res = await fetch('/api/imagekit-auth');
    const data = await res.json();
    return data;
  } catch (err: any) {
    throw new Error('Failed to fetch imagekit auth data', err);
  }
};

export function Providers({ children, themeProp }: ProvidersProps) {
  return (
    <ImageKitProvider
      authenticator={authenticator}
      publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!}
      urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
    >
      <HeroUIProvider>{children}</HeroUIProvider>
    </ImageKitProvider>
  );
}
