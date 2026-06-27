import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers";
import { isForbidden } from "@/features/auth/lib/is-forbidden";
import Forbidden from "@/features/forbidden/components/forbidden";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DealSense — Car Price Recommendations",
  description: "Find recommended prices for used cars based on real sale data.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const forbidden = await isForbidden();
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex h-full flex-col bg-white font-sans text-zinc-900">
        <Providers>
          <Header />
          {forbidden ?
              <Forbidden /> :
              <main className="h-full">{children}</main>
          }
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}