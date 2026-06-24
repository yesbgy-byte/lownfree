import type { Metadata, Viewport } from 'next'
import { Geist, Noto_Sans_KR } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

const notoKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-noto-kr',
  preload: false,
  display: 'swap',
})

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
    <html lang="ko" className={`${geist.variable} ${notoKR.variable} h-full`}>
      <body className="min-h-full bg-[#eef3fd] text-slate-900 antialiased">{children}</body>
    </html>
  )
}
