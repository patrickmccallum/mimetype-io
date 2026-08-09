import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import Script from "next/script"
import { SITE_URL, OG_IMAGE } from "@/lib/pages"
import "./globals.css"

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-montserrat",
})

const GA_MEASUREMENT_ID = "G-XPG13CGVHN"

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "mimetype.io - Check MIME types from files",
    description:
        "Find mimetypes, alternatives, and lookup resources easily in your browser.",
    openGraph: {
        type: "website",
        images: [OG_IMAGE],
    },
    twitter: {
        card: "summary_large_image",
        site: "@mimetypeio",
        creator: "@patsnacks",
        images: [OG_IMAGE],
    },
    icons: { icon: "/favicon.ico" },
}

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en" className={montserrat.variable}>
            <body>
                {children}
                {/*
                 * Replaces gatsby-plugin-google-gtag. afterInteractive keeps it
                 * off the critical path; the config mirrors the old plugin
                 * options (anonymised IP, session-only cookies, respect DNT).
                 */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="gtag-init" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        if (navigator.doNotTrack !== '1' && window.doNotTrack !== '1') {
                            gtag('config', '${GA_MEASUREMENT_ID}', {
                                anonymize_ip: true,
                                cookie_expires: 0
                            });
                        }
                    `}
                </Script>
            </body>
        </html>
    )
}
