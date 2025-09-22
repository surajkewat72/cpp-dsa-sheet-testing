import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import FooterWrapper from "@/components/FooterWrapper"; 
import BotWidget from "@/components/BotWidget";
import { ThemeProvider } from "@/components/theme-provider";
import ScrollToTop from "@/components/ScrollToTopBottom";
import ScrollToTopBottom from "@/components/ScrollToTopBottom";
import { QuestionProvider } from "@/contexts/QuestionContext";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DSAMate v2 - Your Ultimate DSA Practice Platform",
    template: "%s | DSAMate v2"
  },
  description:
    "Master Data Structures & Algorithms with DSAMate v2. 450+ curated DSA problems with solutions, progress tracking, smart filters, and daily POTD. Perfect for coding interviews, placements, and competitive programming. Join 3000+ developers mastering DSA.",
  keywords: [
    "DSA practice",
    "Data Structures and Algorithms",
    "coding interview preparation",
    "leetcode problems",
    "competitive programming",
    "DSA sheet",
    "coding questions",
    "algorithm practice",
    "programming interview",
    "CPP DSA",
    "Java DSA",
    "Python DSA",
    "GeeksforGeeks",
    "HackerRank",
    "SPOJ",
    "coding ninjas"
  ],
  authors: [{ name: "DSAMate Team" }],
  creator: "DSAMate",
  publisher: "DSAMate",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dsamate-v2.vercel.app",
    siteName: "DSAMate v2",
    title: "DSAMate v2 - Your Ultimate DSA Practice Platform",
    description: "Master Data Structures & Algorithms with 450+ curated problems, progress tracking, and smart filters. Join 3000+ developers mastering DSA for coding interviews.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "DSAMate v2 - DSA Practice Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DSAMate v2 - Your Ultimate DSA Practice Platform",
    description: "Master Data Structures & Algorithms with 450+ curated problems, progress tracking, and smart filters. Join 3000+ developers mastering DSA.",
    images: ["/og-image.svg"],
    creator: "@dsamate",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  metadataBase: new URL("https://dsamate-v2.vercel.app"),
  alternates: {
    canonical: "/",
  },
  category: "education",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script id="google-analytics">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${plusJakarta.variable} font-sans`}>
         <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QuestionProvider>
            {children}
            <ScrollToTopBottom/>
          </QuestionProvider>
        </ThemeProvider>
        <BotWidget />
        <FooterWrapper /> 
      </body>
    </html>
  );
}
