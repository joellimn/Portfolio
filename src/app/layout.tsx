import type { Metadata } from "next";
import { Geist, Inter, Noto_Sans_KR, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-noto-kr",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.joellim.co"),
  title: "Joel Lim",
  description: "Joel Lim",
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Joel Lim",
    description: "Joel Lim",
    type: "website",
    locale: "en_US",
    siteName: "Joel Lim",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joel Lim",
    description: "Joel Lim",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${geist.variable} ${playfair.variable} ${inter.variable} ${notoSansKr.variable}`}
    >
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png?v=2"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=2"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="min-h-full bg-white font-sans text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
