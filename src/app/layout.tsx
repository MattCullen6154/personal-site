import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { site } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s — ${site.name}` },
  description: site.tagline,
  openGraph: { title: site.title, description: site.tagline, type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <header className="flex items-center justify-between py-8">
            <Link href="/" className="font-semibold tracking-tight">
              {site.name}
            </Link>
            <nav className="flex gap-5 text-sm text-muted">
              <Link href="/#projects" className="hover:text-foreground">
                Projects
              </Link>
              <Link href="/#about" className="hover:text-foreground">
                About
              </Link>
              {site.links.resume && (
                <a href={site.links.resume} className="hover:text-foreground">
                  Resume
                </a>
              )}
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-24 border-t border-border py-8 text-sm text-muted">
            © {new Date().getFullYear()} {site.name}
          </footer>
        </div>
      </body>
    </html>
  );
}
