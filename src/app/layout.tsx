'use client'

import type React from "react"
// import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "QuizMaster - Create & Take Quizzes",
//   description: "A modern quiz generator application for creating and taking interactive quizzes",
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Header />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-center"  />
        </ThemeProvider>

        <Footer />
      </body>
    </html>
  )
}
