import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { lineSeed } from './fonts'
import "./globals.css";

import AOSProvider from '../components/AOSProvider';

export const metadata: Metadata = {
  title: "หอพักนักศึกษา",
  description: "ระบบจัดการหอพักนักศึกษาแบบ end-to-end",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lineSeed.variable} font-line-seed antialiased`}
      >
        <AOSProvider>
        {children}
        </AOSProvider>
      </body>
    </html>
  );
}
