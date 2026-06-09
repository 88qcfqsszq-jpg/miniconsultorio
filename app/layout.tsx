import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { AnalyticsPageView } from "@/components/AnalyticsPageView";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini Consultório OSCE",
  description: "Ferramenta de treinamento para simulação clínica estruturada (OSCE)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <AnalyticsPageView />
        </Suspense>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
