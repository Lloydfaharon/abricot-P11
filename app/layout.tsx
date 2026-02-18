import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DataProvider } from "./context/DataContext";
import "./globals.css";

import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Plateforme de gestion de projets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DataProvider>
          {children}
          <Toaster position="bottom-center" richColors closeButton />
        </DataProvider>
      </body>
    </html>
  );
}
