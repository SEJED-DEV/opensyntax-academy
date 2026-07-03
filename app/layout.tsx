import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/SEO/JsonLd"
import { ClientWrapper } from "@/components/client-wrapper"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const BASE_URL = "https://opensyntax-academy.vercel.app"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "OpenSyntax Academy — Premium Open-Source Learning Platform",
    template: "%s — OpenSyntax Academy",
  },
  description:
    "Master Advanced Discord Development and Full-Stack Web Engineering. Free, community-funded, and open-source. Level up your programming career with 11 expert learning paths.",
  keywords: [
    "discord bot development",
    "next.js course",
    "typescript tutorial",
    "python data science",
    "devops kubernetes",
    "open source learning",
    "free programming courses",
    "web engineering",
    "AI ML engineering",
    "blockchain solidity",
    "react advanced patterns",
  ],
  authors: [{ name: "OpenSyntax Community", url: BASE_URL }],
  creator: "OpenSyntax Academy",
  publisher: "OpenSyntax Academy",
  openGraph: {
    title: "OpenSyntax Academy — Premium Open-Source Learning Platform",
    description:
      "Master Advanced Discord Development and Full-Stack Web Engineering. Free, community-funded, and open-source. Level up your programming career.",
    url: BASE_URL,
    siteName: "OpenSyntax Academy",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "OpenSyntax Academy — Premium Open-Source Learning Platform",
    description:
      "Master Advanced Discord Development and Full-Stack Web Engineering. Free, community-funded, and open-source.",
    creator: "@TSSEJED",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png",  media: "(prefers-color-scheme: dark)"  },
      { url: "/icon.svg",             type: "image/svg+xml"                   },
    ],
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: BASE_URL,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <OrganizationJsonLd url={BASE_URL} />
        <WebsiteJsonLd />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
