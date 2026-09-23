import type { Metadata } from "next";
import "@/app/globals.css"; // Uses root CSS tokens

export const metadata: Metadata = {
  title: "FarmReem OS | Internal Operations Portal",
  description: "Internal operating portal for FarmReem B2B foodservice supply.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-[#FAF7F2]">
      <body className="h-full antialiased font-sans text-[#111A17] bg-[#FAF7F2]">
        {children}
      </body>
    </html>
  );
}
