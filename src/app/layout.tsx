import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import Navbar from "@/components/shared/Navbar";
import AuthRedirectHandler from "@/components/shared/AuthRedirectHandler";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Personal Tracker",
  description: "Track your savings and calories",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#000000",
                borderRadius: 8,
                colorBorder: "#8c8c8c", // Darker borders
                colorBorderSecondary: "#a6a6a6", // Darker secondary borders
              },
            }}
          >
            <AuthRedirectHandler />
            <Navbar />
            {children}
          </ConfigProvider>
        </AntdRegistry>
        <Analytics />
      </body>
    </html>
  );
}
