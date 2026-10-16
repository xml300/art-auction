import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { ErrorProvider } from "@/components/ErrorProvider";
import { ErrorBoundary } from "./ErrorBoundary";
import Error from "./Error";
import { ToastProvider } from "@/contexts/ToastContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css"; 

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Artsyl — Curated Fine Digital Art Auctions",
  description: "The premier auction house for verified digital fine art provenance, rare lot curation, and custodial settlement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var isDark=t==="dark"||(!t&&window.matchMedia("(prefers-color-scheme: dark)").matches);if(isDark){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark";}else{document.documentElement.classList.remove("dark");document.documentElement.style.colorScheme="light";}}catch(_){}})();`,
          }}
        />
      </head>
      <body
        className="font-sans antialiased min-h-screen bg-background text-text selection:bg-accent/20 selection:text-text"
      >
        <ErrorBoundary fallback={Error}>
          <ErrorProvider>
            <ToastProvider>
              <ThemeProvider>
                {children}
              </ThemeProvider>
            </ToastProvider>
          </ErrorProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

