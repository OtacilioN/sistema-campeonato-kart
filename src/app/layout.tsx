import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PwaRuntime } from "@/components/PwaRuntime";
import { BottomNav, TopBar } from "@/components/PublicNav";
import { appInfo } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: appInfo.publicName,
  description: appInfo.description,
  applicationName: appInfo.publicName,
  metadataBase: new URL(appInfo.productionUrl),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: appInfo.shortName,
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/pwa/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#E10600",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <PwaRuntime />
        <TopBar />
        <main className="app-shell">{children}</main>
        <BottomNav />
      </body>
    </html>
  );
}
