import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { profile } from "@/content/profile";
import { socialAccounts } from "@/content/social";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "G-34W7G6FYV8";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shreyansh.cc"),
  title: {
    default: "Shreyansh Patni — Developer & Founder",
    template: "%s — Shreyansh Patni",
  },
  description:
    "Developer and founder building software products, SaaS solutions, and media brands.",
  alternates: {
    canonical: "https://shreyansh.cc",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://shreyansh.cc",
    siteName: "Shreyansh Patni",
    title: "Shreyansh Patni — Developer & Founder",
    description:
      "Developer and founder building software products, SaaS solutions, and media brands.",
    images: [
      {
        url: "https://shreyansh.cc/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Shreyansh Patni — Developer & Founder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shreyansh Patni — Developer & Founder",
    description:
      "Developer and founder building software products, SaaS solutions, and media brands.",
    creator: "@shreyanshpatni_",
    images: ["https://shreyansh.cc/images/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  url: "https://shreyansh.cc",
  image: "https://shreyansh.cc/images/profile/avatar.png",
  description: profile.about,
  sameAs: socialAccounts.map((account) => account.url),
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Shreyansh Patni",
  url: "https://shreyansh.cc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([jsonLdPerson, jsonLdWebSite]),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <SmoothCursor />
        {children}
      </body>
    </html>
  );
}
