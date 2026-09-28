import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "FarmReem Admin",
  description: "FarmReem Internal Operations Portal",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#FAF7F2]">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.jpg" />
      </head>
      <body className="h-full antialiased font-sans text-[#111A17] bg-[#FAF7F2]">
        {children}
      </body>
    </html>
  );
}
