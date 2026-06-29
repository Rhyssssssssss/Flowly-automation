import { DM_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/global/theme-provider"
import { cn } from "@/lib/utils"
import Navbar from "@/components/global/navbar"
import { ClerkProvider } from "@clerk/nextjs"
import ModalProvider from "@/providers/modal-provider"
import { Toaster } from "@/components/ui/sonner"
import { BillingProvider } from "@/providers/billing-provider"

const font = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn("antialiased", font.variable, "font-sans")}
      >
        <body>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <BillingProvider>
              <ModalProvider>
                {children}
                <Toaster />
              </ModalProvider>
            </BillingProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
