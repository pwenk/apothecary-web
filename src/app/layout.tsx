import type { Metadata, Viewport } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
  display: "swap",
});

const body = Newsreader({
  subsets: ["latin"],
  variable: "--font-body",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const indexable = process.env.APOTHECARY_INDEX === "yes";

export const metadata: Metadata = {
  title: { default: "Apothecary · Drugs, food, hormones & desire", template: "%s · Apothecary" },
  description:
    "Field notes on how drugs, food, hormones and desire really work: mechanisms first, evidence marked honestly, written to be read in one sitting.",
  robots: indexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [{ color: "#f4efe6" }],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
