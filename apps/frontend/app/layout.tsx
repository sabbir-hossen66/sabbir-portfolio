import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/app/components/theme-provider";
import { DotGridBg } from "@/app/components/dot-grid-bg";
import { CursorFX } from "@/app/components/cursor-fx";
import { DevTerminal } from "@/app/components/dev-terminal";
import { WhatsAppFab } from "@/app/components/whatsapp-fab";
import { siteConfig } from "@/lib/data";
// @ts-ignore Next.js handles global CSS imports at build time.
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "MERN Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Front-End Engineer",
    "Full Stack Developer",
    "TypeScript",
    "NestJS",
    "Sabbir Hossen",
    "Portfolio",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f1a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider>
          <DotGridBg />
          <div className="relative isolate flex min-h-screen flex-col">
            {children}
          </div>
          <DevTerminal />
          <CursorFX />
          <WhatsAppFab />
        </ThemeProvider>
      </body>
    </html>
  );
}
