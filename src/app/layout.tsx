import type { Metadata } from "next";
import "./globals.css";
import AuthContext from './context/AuthContext';
import AuthGuard from "./components/auth/authGuard";


export const metadata: Metadata = {
  title: "Kandai Stamp v1.0.0",
  description: "関大文化フェスティバルスタンプ企画",
  alternates: {
    canonical: "https://www.bunfes.com/",
  },
  metadataBase: new URL("https://www.bunfes.com/"),
  openGraph: {
    title: "関大文化フェス",
    siteName: "関大文化フェス",
    type: "website",
    url:"https://www.bunfes.com/",
    images: [
      {
        url: "https://www.bunfes.com/og-image.png",
        width: 1200,
        height: 1200,
        alt: "関大文化フェス",
      },
    ],
  },
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode}>) {
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
