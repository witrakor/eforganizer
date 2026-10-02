import { Suspense } from "react";
import NavigationState from "@/components/navigation-state";
import { headers } from "next/headers";
import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans-thai/400.css";
import "@fontsource/ibm-plex-sans-thai/500.css";
import "@fontsource/ibm-plex-sans-thai/600.css";
import "@fontsource-variable/manrope";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "Elite Flow — Event Organizer",
    template: "%s | Elite Flow",
  },
  description:
    "ทีมวางแผนและจัดงานอีเวนท์ ขอนแก่น · Event planning & management in Khon Kaen",
  metadataBase: new URL(process.env.SITE_URL || "http://localhost:3100"),
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale =
    (await headers()).get("x-eliteflow-locale") === "en" ? "en" : "th";
  return (
    <html lang={locale}>
      <body>
        <Suspense fallback={null}>
          <NavigationState />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
