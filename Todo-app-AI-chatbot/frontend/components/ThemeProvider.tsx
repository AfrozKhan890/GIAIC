'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useEffect, useState, type ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export default function ThemeProvider({ children }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <>{children}</>

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey="tasksync-theme"
    >
      {children}
    </NextThemesProvider>
  )
}
