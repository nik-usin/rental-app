"use client"
import { createContext, useContext, useEffect, useState } from "react"
import ru from "@/messages/ru.json"
import en from "@/messages/en.json"
import de from "@/messages/ru.json"
import fr from "@/messages/ru.json"
import zh from "@/messages/ru.json"
import ar from "@/messages/ru.json"
import es from "@/messages/ru.json"
import tr from "@/messages/ru.json"
import kk from "@/messages/ru.json"
import uz from "@/messages/ru.json"

const messages: Record<string, any> = { ru, en, de, fr, zh, ar, es, tr, kk, uz }

const LangContext = createContext<{ t: (key: string) => string; lang: string; setLang: (l: string) => void }>({
  t: (key) => key,
  lang: "ru",
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState("ru")

  useEffect(() => {
    const saved = localStorage.getItem("language") || "ru"
    setLangState(saved)
  }, [])

  const setLang = (l: string) => {
    setLangState(l)
    localStorage.setItem("language", l)
  }

  const t = (key: string) => {
    const keys = key.split(".")
    let val = messages[lang] || messages["ru"]
    for (const k of keys) {
      val = val?.[k]
      if (!val) break
    }
    return val || key
  }

  return <LangContext.Provider value={{ t, lang, setLang }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)