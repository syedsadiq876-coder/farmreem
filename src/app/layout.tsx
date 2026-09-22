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

const isPreview = process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.farmreem.com"),
  title: {
    default: "B2B Poultry Supply for Hotels & Restaurants | FarmReem",
    template: "%s | FarmReem",
  },
  description: "FarmReem provides B2B live broiler sourcing and scheduled poultry supply for hotels, restaurants, caterers and institutional kitchens based in Dehradun, Uttarakhand.",
  icons: {
    icon: "/images/farmreem-logo.png",
    shortcut: "/images/farmreem-logo.png",
    apple: "/images/farmreem-logo.png",
  },
  keywords: ["B2B poultry supply", "hotel poultry supplier", "restaurant broiler supply Dehradun", "scheduled poultry delivery Uttarakhand", "foodservice supply India"],
  authors: [{ name: "FarmReem B2B Foodservice Supply" }],
  openGraph: {
    title: "B2B Poultry Supply for Hotels & Restaurants | FarmReem",
    description: "FarmReem provides live broiler sourcing and scheduled B2B poultry supply for hotels, restaurants, caterers and institutional kitchens.",
    url: "https://www.farmreem.com",
    siteName: "FarmReem",
    images: [
      {
        url: "/images/hero_foodservice.jpg",
        width: 1200,
        height: 630,
        alt: "FarmReem B2B Poultry Sourcing and Foodservice Supply",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  robots: isPreview
    ? { index: false, follow: false }
    : {
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

