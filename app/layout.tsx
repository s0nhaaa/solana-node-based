import './globals.css'
import { Inter } from 'next/font/google'
import 'reactflow/dist/style.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Solana Node Based',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
