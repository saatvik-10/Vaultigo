'use client';
import type { ThemeProviderProps } from 'next-themes';
import * as React from 'react';
import { HeroUIProvider } from '@heroui/system';
import { useRouter } from 'next/navigation';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ImageKitProvider } from 'imagekitio-next';
import { ToastProvider } from '@heroui/toast';
import { createContext, useContext } from 'react';

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>['push']>[1]
    >;
  }
}

//ImageKit authentication
export const ImageKitAuthContext = createContext<{
  authenticate: () => Promise<{
    signature: string;
    token: string;
    expire: number;
  }>;
}>({
  authenticate: async () => ({ signature: '', token: '', expire: 0 }),
});

export const useImageKitAuth = () => useContext(ImageKitAuthContext);

const authenticator = async () => {
  try {
    const response = await fetch('/api/imagekit-auth');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
};

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  // Default theme properties if none are provided
  const defaultThemeProps: ThemeProviderProps = {
    attribute: 'data-theme',
    defaultTheme: 'dark',
    enableSystem: true,
    enableColorScheme: true,
    disableTransitionOnChange: false,
    forcedTheme: 'dark', // Force dark theme
  };

  // Merge default props with any provided props
  const mergedThemeProps = { ...defaultThemeProps, ...themeProps };

  return (
    <HeroUIProvider navigate={router.push}>
      <ImageKitProvider
        authenticator={authenticator}
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ''}
        urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT || ''}
      >
        <ImageKitAuthContext.Provider value={{ authenticate: authenticator }}>
          <ToastProvider placement='top-right' />
          <NextThemesProvider {...mergedThemeProps}>
            {children}
          </NextThemesProvider>
        </ImageKitAuthContext.Provider>
      </ImageKitProvider>
    </HeroUIProvider>
  );
}
