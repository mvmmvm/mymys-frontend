
import Header from "./header";
import Footer from "./footer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import theme from "../theme";
import { Container } from '@mui/material';
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

            <Container fixed={true}>
             <Header />
              {children}
             <Footer />
            </Container>   

        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
