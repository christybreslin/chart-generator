import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chart Generator",
  description: "Generate beautiful area charts like the crypto dashboard queue chart",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
} 