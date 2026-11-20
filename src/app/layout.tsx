import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "5-Day Palm Oil Processing & Value Addition Training | CSIR-OPRI & WUSC-Ghana",
  description:
    "Official registration and expression of interest portal for the 5-Day Training in Palm Oil Processing and Value Addition organized by CSIR-OPRI and WUSC-Ghana in collaboration with Hon. Kwabena Okyere Darko-Mansah (MP, Takoradi Constituency).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-brand-500 selection:text-white">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
