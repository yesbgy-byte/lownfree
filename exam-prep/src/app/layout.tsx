import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '틈틈 기출 · 자격증 CBT',
  description: '원산지관리사, 보세사, 공인중개사 기출문제를 틈틈이 풀어요',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#eef3fd',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-[#eef3fd] text-slate-900 antialiased">{children}</body>
    </html>
  )
}
