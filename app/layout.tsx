// app/layout.tsx
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { GraphProvider } from "@/hooks";
import { DijkstraProvider } from "@/hooks/dijkstra";
import { mockData } from "@/lib/mocks/songs"; // Import mockData
import { mockData2 } from "@/lib/mocks/songs2";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SONGZ - PA - 2024.2",
  description: "Projeto da disciplina de Projeto de Algoritmos - 2024.2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="py-20">
            <DijkstraProvider graph={mockData2}>
              <GraphProvider graph={mockData}>{children}</GraphProvider>
            </DijkstraProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
