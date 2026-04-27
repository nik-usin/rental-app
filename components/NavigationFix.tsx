"use client"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export default function NavigationFix() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handlePopState = () => {
      router.refresh()
    }
    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [router])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}