import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
});

export const metadata: Metadata = {
  title: "Pathway to Entry",
  description:
    "Pathway to Entry is a NSW YAC–aligned project examining why regional students disengage between choosing a post-school pathway and reaching entry — and designing practical program responses.",
  metadataBase: new URL("https://pathwaytoentry.org.au"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={sourceSans.variable}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="py-10 md:py-14">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
