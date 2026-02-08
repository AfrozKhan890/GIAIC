import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
// import "./globals.css";
import "./../styles/globals.css"
import ThemeProvider from "@/components/ThemeProvider";
import Toaster from "@/components/Toaster";
import ChatDrawer from "@/components/Chat/ChatDrawer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TaskSync AI - Intelligent Task Orchestration Platform",
  description: "AI-powered task management system that understands context, predicts priorities, and automates workflow. Built with precision by Ali Shahid.",
  keywords: ["AI task management", "productivity", "workflow automation", "intelligent scheduling"],
  authors: [{ name: "Afroz Khan", url: "https://github.com/afrozkhan890" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8fafc' },
    { media: '(prefers-color-scheme: dark)', color: '#0a192f' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${outfit.variable} ${inter.variable} antialiased font-sans transition-colors duration-300`}>
        <ThemeProvider>
          {children}
          <ChatDrawer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}