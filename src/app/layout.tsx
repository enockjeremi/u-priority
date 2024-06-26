import QueryClientServerProvider from "./client/context/query-client-provider";
import type { Metadata } from "next";

// import { Poppins } from "next/font/google";
import "./globals.css";

// const poppins = Poppins({ weight: "400", subsets: ["devanagari"] });

export const metadata = {
  title: "U-Priority",
  description: "Organizate de la mejor forma!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientServerProvider>
      <html lang="es">
        <body className="mx-auto h-screen text-sm md:px-0 bg-gray-100">
          {children}
        </body>
      </html>
    </QueryClientServerProvider>
  );
}
