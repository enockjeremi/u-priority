import QueryClientServerProvider from "../client/context/query-client-provider";
import type { Metadata } from "next";

import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({ weight: "400", subsets: ["devanagari"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientServerProvider>
      <html lang="es">
        <body className={poppins.className}>
          <div className="mx-auto h-screen text-sm md:px-0">{children}</div>
        </body>
      </html>
    </QueryClientServerProvider>
  );
}
