import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";

const display = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://bosphorushorology.example"),
  title: {
    default: "Bosphorus Horology | Turkish luxury watches",
    template: "%s | Bosphorus Horology",
  },
  description:
    "Automatic chronographs, hand-wound dress watches and divers, designed and finished in Istanbul with Swiss-level precision.",
  openGraph: {
    title: "Bosphorus Horology",
    description: "Luxury watches designed and finished in Istanbul.",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#0a0f1d",
  colorScheme: "dark",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
