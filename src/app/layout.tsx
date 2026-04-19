import type { Metadata } from "next";
import "./globals.css";
import AuthContext from "./context/AuthContext";
import AuthGuard from "./components/auth/authGuard";

export const metadata: Metadata = {
  title: {
    default: "Kansai Univ Stamp",
    template: "%s | Kansai Univ Stamp",
  },
  description: "関西大学文化フェスティバルスタンプ企画",
  metadataBase: new URL("https://stamprally-two.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "関大文化フェス",
    description: "関西大学文化フェスティバルスタンプ企画",
    siteName: "関大文化フェス",
    type: "website",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 1200,
        alt: "関大文化フェス",
      },
    ],
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "関大文化フェス",
    description: "関西大学文化フェスティバルスタンプ企画",
    images: ["/og-image.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // const currentUser = await getCurrentUser()
  return (
    <html lang="ja">
      <body>
        <AuthContext>
          <AuthGuard>{children}</AuthGuard>
        </AuthContext>
      </body>
    </html>
  );
}
