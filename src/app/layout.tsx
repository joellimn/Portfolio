import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joel Lim",
  description: "Joel Lim",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-white font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
