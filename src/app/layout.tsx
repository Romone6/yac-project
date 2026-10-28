import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Pathway to Entry",
  description:
    "Pathway to Entry is a NSW Youth Advisory Council-aligned initiative helping regional NSW students navigate post-school pathways with consultation, tools, scholarship information and financial support resources.",
  metadataBase: new URL("https://pathwaytoentry.org.au"),
  icons: {
    icon: [{ url: "/pathway-favicon.png?v=1", type: "image/png" }],
    shortcut: "/pathway-favicon.png?v=1",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="min-h-screen bg-[var(--background)] text-slate-900 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-sm focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900 focus:shadow"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="site-main py-10 md:py-14">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
