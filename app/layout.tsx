import type { Metadata } from "next";
import Script from "next/script";
import AuthProvider from "@/components/AuthProvider";
import StructuredData from "@/components/StructuredData";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokeStrategist - Build Your Perfect Pokemon Team | Free Team Builder",
  description: "Create competitive Pokemon teams with our free team builder. Features damage calculator, EV/IV calculator, battle simulator, team analytics, Pokedex, and Google Drive backup. Build OU, VGC, and competitive teams.",
  keywords: [
    "pokemon team builder",
    "pokemon team planner",
    "competitive pokemon",
    "pokemon damage calculator",
    "pokemon ev calculator",
    "pokemon iv calculator",
    "pokemon battle simulator",
    "pokemon team analytics",
    "pokemon pokedex",
    "vgc team builder",
    "ou team builder",
    "showdown team builder",
    "pokemon strategy",
    "pokemon competitive",
    "free pokemon team builder",
  ],
  authors: [{ name: "PokeStrategist" }],
  creator: "PokeStrategist",
  publisher: "PokeStrategist",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pokestrategist.vercel.app",
    title: "PokeStrategist - Build Your Perfect Pokemon Team",
    description: "Free Pokemon team builder with damage calculator, EV/IV calculator, battle simulator, and team analytics. Create competitive teams for OU, VGC, and more.",
    siteName: "PokeStrategist",
    images: [
      {
        url: "https://pokestrategist.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "PokeStrategist - Pokemon Team Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PokeStrategist - Build Your Perfect Pokemon Team",
    description: "Free Pokemon team builder with damage calculator, battle simulator, and team analytics.",
    images: ["https://pokestrategist.vercel.app/og-image.png"],
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  manifest: '/manifest.json',
  metadataBase: new URL('https://pokestrategist.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-LS0MET5N4V" />
        <Script id="google-analytics">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LS0MET5N4V');
          `}
        </Script>
      </head>
      <body className="bg-gray-50">
        <StructuredData />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
