import type { Metadata } from "next";
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
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
