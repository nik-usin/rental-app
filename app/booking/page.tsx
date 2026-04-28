"use client"
import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SideMenu from "@/components/SideMenu"

const studioNames: Record<number, string> = {
  1: "РЎС‚СѓРґРёСЏ 1 вЂ” РЈСЋС‚РЅР°СЏ",
  2: "РЎС‚СѓРґРёСЏ 2 вЂ” РЎРѕРІСЂРµРјРµРЅРЅР°СЏ",
  3: "РЎС‚СѓРґРёСЏ 3 вЂ” РџСЂРµРјРёСѓРј",
}
const studioPrices: Record<number, number> = { 1: 5000, 2: 6500, 3: 9000 }

function getDatesInRange(start: Date, end: Date) {
  const dates = []
  const cur = new Date(start)
  while (cur <= end) {
    dates.push(cur.toISOString().split("T")[0])
    cur.setDate(cur.getDate() + 1)
  }
  return dates
}

function getDaysCount(start: string, end: string) {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function BookingPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const studioId = Number(searchParams.get("studio") || 1)

  const [user, setUser] = useState<any>(null)
  const [bookedDates, setBookedDates] = useState<string[]>([])
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (!saved) { router.push("/auth/login"); return }
    setUser(JSON.parse(saved))
    fetchBookedDates()
  }, [studioId])

  const fetchBookedDates = async () => {
    const res = await fetch(`/api/bookings?studio_id=${studioId}`)
    const data = await res.json()
    const dates: string[] = []
    for (const b of data.bookings || []) {
      getDatesInRange(new Date(b.check_in), new Date(b.check_out)).forEach(d => dates.push(d))
    }
    setBookedDates(dates)
  }

  const isBooked = (date: string) => bookedDates.includes(date)
  const isSelected = (date: string) => {
    if (!checkIn || !checkOut) return date === checkIn
    return date >= checkIn && date <= checkOut
  }
  const isCheckIn = (date: string) => date === checkIn
  const isCheckOut = (date: string) => date === checkOut

  const handleDayClick = (date: string) => {
    const today = new Date().toISOString().split("T")[0]
    if (date < today || isBooked(date)) return
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(date)
      setCheckOut("")
    } else {
      if (date <= checkIn) { setCheckIn(date); setCheckOut(""); return }
      const range = getDatesInRange(new Date(checkIn), new Date(date))
      if (range.some(d => isBooked(d))) { setError("Р’ РІС‹Р±СЂР°РЅРЅРѕРј РґРёР°РїР°Р·РѕРЅРµ РµСЃС‚СЊ Р·Р°РЅСЏС‚С‹Рµ РґР°С‚С‹"); return }
      setError("")
      setCheckOut(date)
    }
  }

  const renderCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const today = new Date().toISOString().split("T")[0]
    const days = []
    const startOffset = firstDay === 0 ? 6 : firstDay - 1

    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
      days.push(dateStr)
    }

    const monthName = monthDate.toLocaleString("ru", { month: "long", year: "numeric" })

    return (
      <div className="flex-1">
        <p className="text-center font-semibold text-gray-700 mb-3 capitalize">{monthName}</p>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {["РџРЅ","Р’С‚","РЎСЂ","Р§С‚","РџС‚","РЎР±","Р’СЃ"].map(d => (
            <div key={d} className="text-xs text-gray-400 font-medium py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, i) => {
            if (!date) return <div key={i} />
            const booked = isBooked(date)
            const selected = isSelected(date)
            const isCI = isCheckIn(date)
            const isCO = isCheckOut(date)
            const isPast = date < today
            return (
              <button
                key={date}
                onClick={() => handleDayClick(date)}
                disabled={booked || isPast}
                className={`
                  relative h-9 w-full rounded-lg text-sm font-medium transition
                  ${isPast ? "text-gray-300 cursor-not-allowed" : ""}
                  ${booked ? "bg-red-100 text-red-400 cursor-not-allowed line-through" : ""}
                  ${selected && !booked && !isPast ? "bg-blue-100 text-blue-700" : ""}
                  ${(isCI || isCO) ? "!bg-blue-600 !text-white rounded-lg" : ""}
                  ${!booked && !isPast && !selected ? "hover:bg-gray-100 text-gray-700" : ""}
                `}
              >
                {new Date(date).getDate()}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  const nextMonth = new Date(currentMonth)
  nextMonth.setMonth(nextMonth.getMonth() + 1)

  const days = checkIn && checkOut ? getDaysCount(checkIn, checkOut) : 0
  const basePrice = studioPrices[studioId] || 5000
  const extraGuests = Math.max(0, guests - 2)
  const totalPrice = days * (basePrice + extraGuests * 1000)

  const handleSubmit = async () => {
    if (!checkIn || !checkOut) { setError("Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚С‹ Р·Р°РµР·РґР° Рё РІС‹РµР·РґР°"); return }
    if (days < 2) { setError("РњРёРЅРёРјР°Р»СЊРЅС‹Р№ СЃСЂРѕРє РїСЂРѕР¶РёРІР°РЅРёСЏ вЂ” 2 РґРЅСЏ"); return }
    setLoading(true); setError("")
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, studio_id: studioId, check_in: checkIn, check_out: checkOut, guests, total_price: totalPrice, comment }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    setSuccess(true)
  }

  if (success) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">рџЋ‰</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Р—Р°СЏРІРєР° РѕС‚РїСЂР°РІР»РµРЅР°!</h2>
        <p className="text-gray-500 mb-6">РњС‹ СЃРІСЏР¶РµРјСЃСЏ СЃ РІР°РјРё РґР»СЏ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ Р±СЂРѕРЅРёСЂРѕРІР°РЅРёСЏ</p>
        <a href="/studios" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">Р’РµСЂРЅСѓС‚СЊСЃСЏ Рє СЃС‚СѓРґРёСЏРј</a><a href="/payment" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 inline-block mt-3">рџ’і РџРµСЂРµР№С‚Рё Рє РѕРїР»Р°С‚Рµ</a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">РљРІР°СЂС‚РёСЂР°РЎСѓС‚РѕРє</a>
        </div>
        <a href={"/studios/" + studioId} className="text-gray-600 hover:text-blue-600 text-sm">в†ђ РќР°Р·Р°Рґ Рє СЃС‚СѓРґРёРё</a>
      </header>

      <div className="max-w-4xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Р‘СЂРѕРЅРёСЂРѕРІР°РЅРёРµ</h1>
        <p className="text-gray-500 mb-8">{studioNames[studioId]}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* РљР°Р»РµРЅРґР°СЂСЊ */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() - 1); setCurrentMonth(d) }} className="p-2 hover:bg-gray-100 rounded-lg">в†ђ</button>
              <span className="text-sm font-medium text-gray-500">Р’С‹Р±РµСЂРёС‚Рµ РґР°С‚С‹ Р·Р°РµР·РґР° Рё РІС‹РµР·РґР°</span>
              <button onClick={() => { const d = new Date(currentMonth); d.setMonth(d.getMonth() + 1); setCurrentMonth(d) }} className="p-2 hover:bg-gray-100 rounded-lg">в†’</button>
            </div>
            <div className="flex gap-6">
              {renderCalendar(currentMonth)}
              {renderCalendar(nextMonth)}
            </div>
            <div className="flex gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-4 h-4 bg-blue-600 rounded inline-block"></span> Р’С‹Р±СЂР°РЅРЅС‹Рµ РґР°С‚С‹</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 bg-red-100 rounded inline-block"></span> Р—Р°РЅСЏС‚Рѕ</span>
              <span className="flex items-center gap-1"><span className="w-4 h-4 bg-gray-100 rounded inline-block"></span> РЎРІРѕР±РѕРґРЅРѕ</span>
            </div>
          </div>

          {/* РС‚РѕРі */}
          <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-4">
            <h2 className="font-bold text-gray-800 text-lg">Р”РµС‚Р°Р»Рё Р±СЂРѕРЅРёСЂРѕРІР°РЅРёСЏ</h2>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">Р—Р°РµР·Рґ</label>
              <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">{checkIn || "РќРµ РІС‹Р±СЂР°РЅРѕ"}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Р’С‹РµР·Рґ</label>
              <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800">{checkOut || "РќРµ РІС‹Р±СЂР°РЅРѕ"}</div>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">Р“РѕСЃС‚РµР№</label>
              <div className="flex items-center gap-3">
                <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 font-bold">в€’</button>
                <span className="font-semibold text-gray-800">{guests}</span>
                <button onClick={() => setGuests(Math.min(4, guests + 1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 font-bold">+</button>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">РљРѕРјРјРµРЅС‚Р°СЂРёР№</label>
              <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="РџРѕР¶РµР»Р°РЅРёСЏ Рє Р·Р°СЃРµР»РµРЅРёСЋ..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-20 focus:outline-none focus:border-blue-400" />
            </div>

            {days > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">{basePrice.toLocaleString()} в‚Ѕ Г— {days} РЅРѕС‡РµР№</span>
                  <span className="text-gray-700">{(basePrice * days).toLocaleString()} в‚Ѕ</span>
                </div>
                {extraGuests > 0 && (
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">Р”РѕРї. РіРѕСЃС‚Рё ({extraGuests} Г— {days} РЅРѕС‡РµР№)</span>
                    <span className="text-gray-700">{(extraGuests * 1000 * days).toLocaleString()} в‚Ѕ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-gray-800 border-t border-gray-200 pt-2 mt-2">
                  <span>РС‚РѕРіРѕ</span>
                  <span>{totalPrice.toLocaleString()} в‚Ѕ</span>
                </div>
              </div>
            )}

            {error && <div className="bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm">{error}</div>}

            <button onClick={handleSubmit} disabled={loading || !checkIn || !checkOut} className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 mt-auto">
              {loading ? "РћС‚РїСЂР°РІРєР°..." : "Р—Р°Р±СЂРѕРЅРёСЂРѕРІР°С‚СЊ"}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Р—Р°РіСЂСѓР·РєР°...</div>}>
      <BookingPageInner />
    </Suspense>
  )
}