import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ErrorProvider } from "@/components/ErrorProvider";
import { ErrorBoundary } from "./ErrorBoundary";
import Error from "./Error";
import { ToastProvider } from "@/contexts/ToastContext";
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
          <ErrorBoundary fallback={Error}>
            <ErrorProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </ErrorProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
