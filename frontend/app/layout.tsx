import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { Providers } from "./providers";
import { Layout } from "@/components/Layout";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nest Lab Blog",
  description: "A clean, modern blog",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <AppRouterCacheProvider>
          <Providers>
            <Layout>{children}</Layout>
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
