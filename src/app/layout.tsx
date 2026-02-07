import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider, AuthProvider } from "@/context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "DompetKu - Kelola Keuangan dengan Mudah",
  description: "Aplikasi pengelolaan keuangan pribadi yang mudah dan menyenangkan. Catat transaksi, kelola anggaran, dan capai target finansialmu.",
  keywords: ["expense tracker", "keuangan", "anggaran", "tabungan", "indonesia"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
