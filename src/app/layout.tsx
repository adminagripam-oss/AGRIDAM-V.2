import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agridam - Master Data Management Perkebunan Kelapa Sawit',
  description: 'Sistem Terpusat Master Data Perkebunan Kelapa Sawit (Maker-Checker Workflow)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <body className="min-h-screen bg-[#07120e] text-slate-100 antialiased font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
