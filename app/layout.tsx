import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Bitcoin } from "@/components/icons"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BTCPay Server - Greenfield API Demo",
  description: "A demonstration of integrating Bitcoin payments with BTCPay Server Greenfield API",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-background">
            <header className="border-b py-4">
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold flex items-center gap-2">
                    <Bitcoin className="h-5 w-5 text-orange-500" />
                    BTCPay Demo Store
                  </h1>
                </div>
              </div>
            </header>
            {children}
            <footer className="border-t py-6 mt-12">
              <div className="container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground">Powered by BTCPay Server Greenfield API</p>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
