import Header from "./header";
import Footer from "./footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Murder Maker!!!",
  description: "簡単なオリジナルマーダーミステリーが楽しめるサービスです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <Header />
          <div className="mt-[120px]"></div>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "calc(100vh - 80px)" }}>
            {children}
          </div>
          <div className="mb-[120px]"></div>
          <Footer />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}