import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ErrorProvider } from "@/components/ErrorProvider";
import { ErrorBoundary } from "./ErrorBoundary";
import Error from "./Error";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var isDark=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(isDark){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}else{document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme="light";}}catch(_){}})();`,
          }}
        />
      </head>
      <body
        className={`${openSans.className} antialiased h-screen bg-background text-text`}
      >
        <div className="animate-fade-in h-full">
          <ErrorBoundary fallback={Error}>
            <ErrorProvider>
              <ToastProvider>
                <ThemeProvider>
                  {children}
                </ThemeProvider>
              </ToastProvider>
            </ErrorProvider>
          </ErrorBoundary>
        </div>
      </body>
    </html>
  );
}
