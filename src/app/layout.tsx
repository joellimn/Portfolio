import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: "300",
  style: ["normal", "italic"],
  variable: "--font-source-sans",
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
      className={`h-full antialiased ${sourceSans.variable}`}
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
      <body className="min-h-full bg-white font-sans font-light text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
