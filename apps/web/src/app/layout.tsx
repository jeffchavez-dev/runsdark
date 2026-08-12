import type { Metadata } from "next";
import "./globals.css";
import { TrpcProvider } from "@/lib/trpc/provider";

export const metadata: Metadata = {
  title: "RunsDark",
  description: "The ops layer Filipino EAs run on. Purpose-built tools for global executive support.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-base-base text-text-primary">
        <TrpcProvider>
          {children}
        </TrpcProvider>
      </body>
    </html>
  );
}
