import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: "400",
});

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Frames | Know Before You Cut",
  description:
    "Frames captures your walls before drywall goes up so trades always know what's hidden. Join the early access waitlist.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Frames | Know Before You Cut",
    description:
      "Frames captures your walls before drywall goes up so trades always know what's hidden. Join the early access waitlist.",
  },
  twitter: {
    card: "summary",
    title: "Frames | Know Before You Cut",
    description:
      "Frames captures your walls before drywall goes up so trades always know what's hidden. Join the early access waitlist.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${jakarta.variable} ${geistMono.variable} ${dmSerif.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
