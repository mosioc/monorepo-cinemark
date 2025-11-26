import type { Metadata } from "next";
import { ReactNode } from "react";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "CineMark",
  description: "For cine-philes, by cine-philes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${cinzel.variable} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
