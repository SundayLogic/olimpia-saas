import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";
import { Providers } from "./providers"; 
import { Toaster } from "@/components/ui/toaster";
import "./global.css"; // Tailwind & global styles

const lato = Lato({
  subsets: ['latin'],
  weight: ['100', '300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
});

const APP_NAME = "Restaurant Manager";
const APP_DESCRIPTION = "A modern restaurant management platform";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  // Removed supabase session fetch since layout doesn’t seem to need it.

  return (
    <html 
      lang="en" 
      className={`${lato.variable} antialiased`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen bg-background font-sans">
        <Providers>
          <main className="relative flex min-h-screen flex-col">
            {children}
          </main>
          {/* If Toaster is always needed, keep it. Otherwise, consider moving it into specific pages */}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
