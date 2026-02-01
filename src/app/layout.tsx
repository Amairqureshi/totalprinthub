import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/Header";
import { B2BPricingPopup } from "@/components/marketing/B2BPricingPopup";
import { MobileAppPopup } from "@/components/marketing/MobileAppPopup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TotalPrintHub - Custom Printing Solutions for India",
  description: "Professional custom printing services with dynamic pricing, instant quotes, and fast delivery across India.",
  keywords: ["custom printing", "business cards", "stickers", "banners", "India printing"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          <Header />
          {children}
          {/* <B2BPricingPopup /> */}
          {/* <MobileAppPopup /> */}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
