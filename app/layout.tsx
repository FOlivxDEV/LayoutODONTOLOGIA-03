import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteConfig } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.seo.canonicalUrl),
  title: siteConfig.seo.title,
  description: siteConfig.seo.description,
  alternates: { canonical: "/" },
  openGraph: { title: siteConfig.seo.title, description: siteConfig.seo.description, type: "website", locale: "pt_BR", siteName: siteConfig.clinic.name, images: [{ url: "/og-layout3.png", width: 1731, height: 909, alt: "JR Odontologia — Excelência que se revela em cada sorriso." }] },
  twitter: { card: "summary_large_image", title: siteConfig.seo.title, description: siteConfig.seo.description, images: ["/og-layout3.png"] },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#071b2b" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Dentist",
    name: siteConfig.clinic.name,
    url: siteConfig.seo.canonicalUrl,
    telephone: `+${siteConfig.clinic.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.clinic.address,
      addressLocality: "Cubatão",
      addressRegion: "SP",
      postalCode: siteConfig.clinic.postalCode,
      addressCountry: "BR",
    },
    sameAs: [siteConfig.clinic.instagram],
  };
  return <html lang="pt-BR"><body>{children}<script type="application/ld+json">{JSON.stringify(structuredData).replace(/</g, "\\u003c")}</script></body></html>;
}
