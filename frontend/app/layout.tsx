import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Auth App - 2FA',
  description: 'Aplicación con autenticación de dos factores',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
