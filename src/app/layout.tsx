import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Joel Lim · MP3 Design Portfolio",
  description:
    "A tactile, retro-futuristic UX portfolio inspired by the iPod Classic.",
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
