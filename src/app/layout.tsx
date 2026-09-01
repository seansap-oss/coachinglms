import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PlanetFashion — Wear Your Planet | Austria",
  description: "PlanetFashion — Minimal modern apparel for Women, Men, Kids & Baby. Hero video/image editable, ticker, UPI/GPay gateway, discount coupons, admin, fully responsive PWA ready for iOS/Android.",
  keywords: ["planetfashion", "fashion", "apparel", "minimal", "austria", "PF"],
  manifest: "/manifest.json",
  themeColor: "#e10600",
  appleWebApp: { capable: true, title: "PlanetFashion", statusBarStyle: "default" },
  icons: { icon: "/icon-192.png", apple: "/icon-192.png" },
  openGraph: {
    title: "PlanetFashion — Wear Your Planet",
    description: "Minimal, modern, timeless everyday clothing. Shop the new collection.",
    type: "website",
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
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white" style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
        <Providers>{children}</Providers>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));}`,
          }}
        />
      </body>
    </html>
  );
}
