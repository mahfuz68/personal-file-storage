import { Geist, Geist_Mono } from "next/font/google"
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css"
import { ReactQueryProvider } from '@/components/providers/ReactQueryProvider'
import { Toaster } from 'sonner'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ReactQueryProvider>
            {children}
            <Toaster
              position="top-right"
              gap={8}
              toastOptions={{
                duration: 4000,
                unstyled: true,
                classNames: {
                  toast: [
                    'flex items-start gap-3 w-full px-4 py-3.5 rounded-xl',
                    'shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.04)]',
                    'font-sans text-sm font-medium',
                  ].join(' '),
                  title: 'text-white text-sm font-medium leading-none',
                  description: 'text-xs leading-relaxed mt-1 opacity-70',
                  icon: 'flex-shrink-0 mt-0.5',
                  success: [
                    'bg-[#0D1F14]',
                    '[&_[data-title]]:text-[#4ADE80]',
                    '[&_[data-description]]:text-[#4ADE80]',
                    'border border-[rgba(34,197,94,0.3)]',
                    '[border-left:2px_solid_#22C55E]',
                  ].join(' '),
                  error: [
                    'bg-[#1F0D0D]',
                    '[&_[data-title]]:text-[#F87171]',
                    '[&_[data-description]]:text-[#F87171]',
                    'border border-[rgba(239,68,68,0.3)]',
                    '[border-left:2px_solid_#EF4444]',
                  ].join(' '),
                  info: [
                    'bg-[#0D1220]',
                    '[&_[data-title]]:text-[#60A5FA]',
                    '[&_[data-description]]:text-[#F87171]',
                    'border border-[rgba(59,130,246,0.3)]',
                    '[border-left:2px_solid_#3B82F6]',
                  ].join(' '),
                  warning: [
                    'bg-[#1A1500]',
                    '[&_[data-title]]:text-[#FCD34D]',
                    '[&_[data-description]]:text-[#FCD34D]',
                    'border border-[rgba(234,179,8,0.3)]',
                    '[border-left:2px_solid_#EAB308]',
                  ].join(' '),
                },
              }}
            />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
