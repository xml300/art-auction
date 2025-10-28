import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Artsyl",
  description: "A luxury digital art auction platform tailored for artists and collectors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased h-screen bg-white text-black dark:bg-dark-background dark:text-dark-text`}
      >
        <div className="animate-fade-in h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
