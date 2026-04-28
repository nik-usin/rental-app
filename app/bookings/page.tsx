"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

const studioNames: Record<number, Record<string, string>> = {
  1: { ru: "Студия 1 — Уютная", en: "Studio 1 — Cozy" },
  2: { ru: "Студия 2 — Современная", en: "Studio 2 — Modern" },
  3: { ru: "Студия 3 — Премиум", en: "Studio 3 — Premium" },
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-red-100 text-red-600 border-red-200",
}

const studioCovers: Record<number, string> = {
  1: "/studios/studio1/__1_01.jpg",
  2: "/studios/studio2/__2_01.jpg",
  3: "/studios/studio3/__3_01.jpg",
}

export default function MyBookingsPage() {
  const router = useRouter()
  const { t, lang } = useLang()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all"|"pending"|"confirmed"|"cancelled">("all")

  const statusNames: Record<string, string> = {
    pending: `⏳ ${t("bookings.status_pending")}`,
    confirmed: `✅ ${t("bookings.status_confirmed")}`,
    cancelled: `❌ ${t("bookings.status_cancelled")}`,
  }

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (!saved) { router.push("/auth/login"); return }
    const u = JSON.parse(saved)
    setUser(u)
    fetchBookings(u.id)
  }, [])

  const fetchBookings = async (userId: number) => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  const cancelBooking = async (id: number) => {
    if (!confirm(lang === "ru" ? "Вы уверены что хотите отменить бронирование?" : "Are you sure you want to cancel?")) return
    setCancelling(id)
    await fetch("/api/bookings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "cancelled" }),
    })
    setBookings(bookings.map(b => b.id === id ? { ...b, status: "cancelled" } : b))
    setCancelling(null)
  }

  const getDays = (checkIn: string, checkOut: string) => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  const formatDate = (str: string) => new Date(str).toLocaleDateString(lang === "ru" ? "ru" : "en", { day: "numeric", month: "long", year: "numeric" })

  const filtered = filter === "all" ? bookings : bookings.filter(b => b.status === filter)
  const upcoming = bookings.filter(b => b.status === "confirmed" && b.check_in >= new Date().toISOString().split("T")[0])
  const totalSpent = bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.total_price, 0)

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">{lang === "ru" ? "Загрузка..." : "Loading..."}</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/profile" className="text-gray-600 hover:text-blue-600 text-sm">← {t("profile.title")}</a>
      </header>

      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("bookings.title")}</h1>
        <p className="text-gray-500 mb-8">{t("nav.home")}! {user?.name}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-blue-600">{bookings.length}</p>
            <p className="text-gray-500 text-sm mt-1">{lang === "ru" ? "Всего броней" : "Total bookings"}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-green-600">{upcoming.length}</p>
            <p className="text-gray-500 text-sm mt-1">{lang === "ru" ? "Предстоящих" : "Upcoming"}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-purple-600">{totalSpent.toLocaleString()} ₽</p>
            <p className="text-gray-500 text-sm mt-1">{lang === "ru" ? "Потрачено" : "Spent"}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "all", label: lang === "ru" ? "Все" : "All" },
            { key: "pending", label: `⏳ ${t("bookings.status_pending")}` },
            { key: "confirmed", label: `✅ ${t("bookings.status_confirmed")}` },
            { key: "cancelled", label: `❌ ${t("bookings.status_cancelled")}` },
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key as any)} className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === f.key ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-800 font-semibold mb-2">{t("bookings.empty")}</p>
            <p className="text-gray-400 text-sm mb-6">{lang === "ru" ? "Выберите студию и забронируйте онлайн" : "Choose a studio and book online"}</p>
            <a href="/studios" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">{t("bookings.book_new")}</a>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map(b => {
              const days = getDays(b.check_in, b.check_out)
              const isPast = b.check_out < new Date().toISOString().split("T")[0]
              const canCancel = b.status === "pending" || (b.status === "confirmed" && !isPast)
              return (
                <div key={b.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="relative md:w-48 h-40 md:h-auto bg-gray-100 flex-shrink-0">
                      <img src={studioCovers[b.studio_id]} alt={studioNames[b.studio_id][lang]} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{studioNames[b.studio_id][lang]}</h3>
                          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mt-1 ${statusColors[b.status]}`}>{statusNames[b.status]}</span>
                        </div>
                        <p className="text-blue-600 font-bold text-xl">{b.total_price?.toLocaleString()} ₽</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-1">{t("bookings.checkin")}</p>
                          <p className="text-gray-800 font-semibold text-sm">{formatDate(b.check_in)}</p>
                          <p className="text-gray-400 text-xs">{lang === "ru" ? "с 14:00" : "from 14:00"}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-gray-400 text-xs mb-1">{t("bookings.checkout")}</p>
                          <p className="text-gray-800 font-semibold text-sm">{formatDate(b.check_out)}</p>
                          <p className="text-gray-400 text-xs">{lang === "ru" ? "до 12:00" : "until 12:00"}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-4 text-sm text-gray-500">
                          <span>🌙 {days} {lang === "ru" ? (days === 1 ? "ночь" : days < 5 ? "ночи" : "ночей") : (days === 1 ? "night" : "nights")}</span>
                          <span>👥 {b.guests} {lang === "ru" ? (b.guests === 1 ? "гость" : "гостей") : (b.guests === 1 ? "guest" : "guests")}</span>
                        </div>
                        <div className="flex gap-2">
                          {b.status === "confirmed" && (
                            <a href="/payment" className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg text-sm font-medium">💳 {lang === "ru" ? "Оплатить" : "Pay"}</a>
                          )}
                          {canCancel && (
                            <button onClick={() => cancelBooking(b.id)} disabled={cancelling === b.id} className="bg-red-50 text-red-500 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50">
                              {cancelling === b.id ? (lang === "ru" ? "Отмена..." : "Cancelling...") : t("bookings.cancel_btn")}
                            </button>
                          )}
                        </div>
                      </div>
                      {b.comment && <p className="text-gray-400 text-xs mt-3 italic">💬 {b.comment}</p>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}