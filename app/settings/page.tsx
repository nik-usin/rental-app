"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

const languages = [
  { code: "ru", label: "🇷🇺 Русский" },
  { code: "en", label: "🇬🇧 English" },
]

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { t, lang, setLang } = useLang()
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const [notifPermission, setNotifPermission] = useState<string>("default")
  const [notifications, setNotifications] = useState({
    booking_created: true,
    booking_cancelled: true,
    checkin_reminder: true,
    checkout_reminder: true,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setMounted(true)
    const u = localStorage.getItem("user")
    if (!u) { router.push("/auth/login"); return }
    setUser(JSON.parse(u))
    const savedNotif = localStorage.getItem("notifications")
    if (savedNotif) setNotifications(JSON.parse(savedNotif))
    if ("Notification" in window) setNotifPermission(Notification.permission)
  }, [])

  const handleNotification = (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value }
    setNotifications(updated)
    localStorage.setItem("notifications", JSON.stringify(updated))
  }

  const handleLanguage = (code: string) => {
    setLang(code)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) return
    const result = await Notification.requestPermission()
    setNotifPermission(result)
    if (result === "granted") {
      new Notification("КвартираСуток", {
        body: lang === "ru" ? "Уведомления включены!" : "Notifications enabled!",
        icon: "/favicon.ico",
      })
    }
  }

  const notifItems = lang === "ru" ? [
    { key: "booking_created", label: "Создание бронирования", desc: "При успешном бронировании" },
    { key: "booking_cancelled", label: "Отмена бронирования", desc: "При отмене брони" },
    { key: "checkin_reminder", label: "Напоминание о заселении", desc: "За день до заезда" },
    { key: "checkout_reminder", label: "Напоминание о выселении", desc: "За день до выезда" },
  ] : [
    { key: "booking_created", label: "Booking created", desc: "When booking is successful" },
    { key: "booking_cancelled", label: "Booking cancelled", desc: "When booking is cancelled" },
    { key: "checkin_reminder", label: "Check-in reminder", desc: "One day before check-in" },
    { key: "checkout_reminder", label: "Check-out reminder", desc: "One day before check-out" },
  ]

  const themeItems = [
    { value: "light", label: "☀️", name: t("settings.light"), desc: lang === "ru" ? "Всегда светлая" : "Always light" },
    { value: "dark", label: "🌙", name: t("settings.dark"), desc: lang === "ru" ? "Всегда тёмная" : "Always dark" },
    { value: "system", label: "💻", name: t("settings.system"), desc: lang === "ru" ? "Как на устройстве" : "Match device" },
  ]

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/profile" className="text-gray-600 hover:text-blue-600 text-sm">← {t("auth.back")}</a>
      </header>

      <div className="max-w-2xl mx-auto py-10 px-6 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{t("settings.title")}</h1>

        {saved && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">✅ {t("settings.saved")}</div>}

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🎨</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t("settings.theme_title")}</h2>
              <p className="text-gray-400 text-sm">{t("settings.theme_subtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {themeItems.map(item => (
              <button
                key={item.value}
                onClick={() => setTheme(item.value)}
                className={`p-4 rounded-xl border-2 text-center transition ${theme === item.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30" : "border-gray-100 dark:border-gray-700 hover:border-gray-300"}`}
              >
                <p className="text-2xl mb-1">{item.label}</p>
                <p className="font-semibold text-gray-800 dark:text-white text-sm">{item.name}</p>
                <p className="text-gray-400 text-xs mt-1">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🔔</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t("settings.notif_title")}</h2>
              <p className="text-gray-400 text-sm">{t("settings.notif_subtitle")}</p>
            </div>
          </div>
          {notifPermission !== "granted" && (
            <button onClick={requestNotifPermission} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 mb-4 text-sm">
              🔔 {t("settings.allow_notif")}
            </button>
          )}
          {notifPermission === "granted" && <div className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm mb-4">✅ {lang === "ru" ? "Уведомления разрешены" : "Notifications enabled"}</div>}
          {notifPermission === "denied" && <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm mb-4">❌ {lang === "ru" ? "Уведомления заблокированы" : "Notifications blocked"}</div>}
          <div className="flex flex-col gap-4">
            {notifItems.map(n => (
              <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white text-sm">{n.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{n.desc}</p>
                </div>
                <button
                  onClick={() => handleNotification(n.key, !notifications[n.key as keyof typeof notifications])}
                  disabled={notifPermission !== "granted"}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 disabled:opacity-40 ${notifications[n.key as keyof typeof notifications] && notifPermission === "granted" ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${notifications[n.key as keyof typeof notifications] && notifPermission === "granted" ? "translate-x-7" : "translate-x-1"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">🌐</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{t("settings.lang_title")}</h2>
              <p className="text-gray-400 text-sm">{t("settings.lang_subtitle")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => handleLanguage(l.code)}
                className={`px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition ${lang === l.code ? "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400" : "border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300"}`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}