import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ScrollToTop from "@/components/ScrollToTop";
import { ThemeProvider } from "next-themes";
import { LangProvider } from "@/components/LangProvider";
import ChatBot from "@/components/ChatBot";
import NavigationFix from "@/components/NavigationFix";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "КвартираСуток — студии посуточно в Красногорске", template: "%s | КвартираСуток" },
  description: "Уютные студии посуточно в ЖК «Изумрудные холмы», Красногорск. Бесконтактное заселение, Wi-Fi, всё включено. Бронируйте онлайн!",
  keywords: ["студии посуточно", "аренда студии", "Красногорск", "Изумрудные холмы", "посуточно", "апартаменты", "квартира посуточно"],
  authors: [{ name: "На холмах" }],
  creator: "На холмах",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ваш-домен.ru",
    siteName: "КвартираСуток",
    title: "КвартираСуток — студии посуточно в Красногорске",
    description: "Уютные студии посуточно в ЖК «Изумрудные холмы». Бесконтактное заселение, Wi-Fi, всё включено.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "КвартираСуток" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "КвартираСуток — студии посуточно",
    description: "Уютные студии посуточно в Красногорске. Бронируйте онлайн!",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ваш-домен.ru" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-950 transition-colors">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LangProvider>
            <NavigationFix />
            {children}
            <ScrollToTop />
            <ChatBot />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}