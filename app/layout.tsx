import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokeStrategist - Build Your Perfect Team",
  description: "Create, analyze, and share competitive Pokemon teams",
  icons: {
    icon: '/favicon.svg',
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
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
