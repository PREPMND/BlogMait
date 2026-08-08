'use client'

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useThemeStore } from "./theme-store"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  classStyle?: string;
}

export default function ThemeToggle({ classStyle }: ThemeToggleProps) {
  const { isDarkMode, toggleTheme } = useThemeStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (theme === 'dark' && !isDarkMode) {
      useThemeStore.setState({ isDarkMode: true })
    } else if (theme === 'light' && isDarkMode) {
      useThemeStore.setState({ isDarkMode: false })
    }
  }, [])

  const handleToggleTheme = () => {
    toggleTheme()
    setTheme(isDarkMode ? 'light' : 'dark')
  }

  if (!mounted) {
    return <div className={cn("w-11 h-10", classStyle)} />
  }

  return (
    <Button 
      className={cn('w-11 pt-1 md:pt-0', classStyle)} 
      variant='ghost' 
      size='icon' 
      onClick={handleToggleTheme}
    >
      <Sun className={cn(
        "h-5 w-5 transition-all duration-300", 
        isDarkMode ? "rotate-90 scale-0" : "rotate-0 scale-100"
      )} />
      <Moon className={cn(
        "absolute h-5 w-5 transition-all duration-300", 
        isDarkMode ? "rotate-0 scale-100" : "-rotate-90 scale-0"
      )} />
    </Button>
  )
}
