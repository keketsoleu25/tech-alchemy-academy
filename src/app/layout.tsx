import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Tech Alchemy Academy",
    template: "%s | Tech Alchemy Academy",
  },
  description:
    "A gamified data structures and algorithms academy for mastering problem-solving from beginner to Grand Master.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}