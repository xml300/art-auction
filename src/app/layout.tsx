import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
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
        className={`${openSans.className} antialiased h-screen bg-background text-text`}
      >
        <div className="animate-fade-in h-full">
          {children}
        </div>
      </body>
    </html>
  );
}
