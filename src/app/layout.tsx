import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileStickyCTA from "@/components/layout/MobileStickyCTA";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://farmreem.com"),
  title: "FarmReem | Reliable Poultry Supply. Built for Professional Kitchens.",
  description: "Live broiler sourcing and scheduled B2B delivery for hotels, restaurants, caterers and institutional kitchens.",
  icons: {
    icon: "/images/farmreem-logo.png",
    shortcut: "/images/farmreem-logo.png",
    apple: "/images/farmreem-logo.png",
  },
  keywords: ["B2B poultry supply", "commercial kitchen poultry", "hotel poultry supplier", "restaurant broiler sourcing", "scheduled food delivery"],
  authors: [{ name: "FarmReem Sourcing & Logistics" }],
  openGraph: {
    title: "FarmReem — B2B Poultry & Foodservice Supply",
    description: "Reliable poultry supply with scheduled B2B delivery for hotels, restaurants, and caterers.",
    url: "https://farmreem.com",
    siteName: "FarmReem",
    images: [
      {
        url: "/images/hero_foodservice.jpg",
        width: 1200,
        height: 630,
        alt: "FarmReem B2B Poultry Sourcing",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#111A17]">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <MobileStickyCTA />
      </body>
    </html>
  );
}

