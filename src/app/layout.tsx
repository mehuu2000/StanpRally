import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from './ClientLayout';


export const metadata: Metadata = {
  title: "Kandai Stamp v1.0.0",
  description: "関大文化フェスティバルスタンプ企画",
  alternates: {
    canonical: "https://stamp-rally-azure.vercel.app/",
  },
  metadataBase: new URL("https://stamp-rally-azure.vercel.app/"),
  openGraph: {
    title: "関大文化フェス",
    siteName: "関大文化フェス",
    type: "website",
    url:"https://stamp-rally-azure.vercel.app",
    images: [
      {
        url: "https://stamp-rally-azure.vercel.app/og-image.png",
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
