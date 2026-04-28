"use client"
import { Suspense } from "react"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import SideMenu from "@/components/SideMenu"

const studioNames: Record<number, string> = {
  1: "Студия 1 — Уютная",
  2: "Студия 2 — Современная",
  3: "Студия 3 — Премиум",
}
const studioPrices: Record<number, number> = { 1: 5000, 2: 6500, 3: 9000 }

function getDatesInRange(start: Date, end: Date): string[] {
  const dates = []
  const cur = new Date(start)
  while (cur < end) {
    dates.push(cur.toISOString().split("T")[0])
    cur.setDate(cur.getDate() + 1)
  }
  return dates
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [price, setPrice] = useState(studioPrices[studioId] || 5000)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (!saved) { router.push("/auth/login"); return }
    setUser(JSON.parse(saved))
    fetchBookedDates()
    fetchPrice()
  }, [studioId])

  const fetchPrice = async () => {
    const res = await fetch(`/api/studios/${studioId}`)
    if (res.ok) {
      const data = await res.json()
      setPrice(data.price || studioPrices[studioId])
    }
  }

  const fetchBookedDates = async () => {
    const res = await fetch(`/api/bookings?studio_id=${studioId}`)
    const data = await res.json()
    const dates: string[] = []
    for (const b of data.bookings || []) {
      getDatesInRange(new Date(b.check_in), new Date(b.check_out)).forEach(d => dates.push(d))
    }
    setBookedDates(dates)
  }

  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)) : 0
  const totalPrice = nights * price

  const handleDateClick = (dateStr: string) => {
    if (bookedDates.includes(dateStr)) return
    const clicked = new Date(dateStr)
    const today = new Date(); today.setHours(0,0,0,0)
    if (clicked < today) return
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(dateStr); setCheckOut("")
    } else {
      if (dateStr <= checkIn) { setCheckIn(dateStr); setCheckOut(""); return }
      const range = getDatesInRange(new Date(checkIn), new Date(dateStr))
      if (range.some(d => bookedDates.includes(d))) { setError("В выбранном диапазоне есть занятые даты"); return }
      const n = Math.ceil((new Date(dateStr).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))
      if (n < 2) { setError("Минимальный срок бронирования — 2 ночи"); return }
      setCheckOut(dateStr); setError("")
    }
  }

  const handleSubmit = async () => {
    if (!checkIn || !checkOut) { setError("Выберите даты"); return }
    setSubmitting(true); setError("")
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, studio_id: studioId, check_in: checkIn, check_out: checkOut, guests, total_price: totalPrice, comment }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) { setError(data.error); return }
    setSuccess(true)
  }

  const renderCalendar = (monthDate: Date) => {
    const year = monthDate.getFullYear()
    const month = monthDate.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const startOffset = firstDay === 0 ? 6 : firstDay - 1
    const today = new Date(); today.setHours(0,0,0,0)
    const days = []
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`
      const date = new Date(dateStr)
      const isBooked = bookedDates.includes(dateStr)
      const isPast = date < today
      const isCheckIn = dateStr === checkIn
      const isCheckOut = dateStr === checkOut
      const isInRange = checkIn && checkOut && dateStr > checkIn && dateStr < checkOut
      days.push({ day: d, dateStr, isBooked, isPast, isCheckIn, isCheckOut, isInRange })
    }
    const monthNames = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"]
    return (
      <div>
        <p className="text-center font-semibold text-gray-700 mb-3">{monthNames[month]} {year} г.</p>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d => <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <button key={i} onClick={() => d && !d.isBooked && !d.isPast && handleDateClick(d.dateStr)}
              className={`h-9 rounded-lg text-sm font-medium transition
                ${!d ? "invisible" : ""}
                ${d?.isPast ? "text-gray-300 cursor-not-allowed" : ""}
                ${d?.isBooked ? "bg-red-100 text-red-400 cursor-not-allowed line-through" : ""}
                ${d?.isCheckIn || d?.isCheckOut ? "bg-blue-600 text-white" : ""}
                ${d?.isInRange ? "bg-blue-100 text-blue-700" : ""}
                ${!d?.isPast && !d?.isBooked && !d?.isCheckIn && !d?.isCheckOut && !d?.isInRange ? "hover:bg-gray-100 text-gray-700" : ""}
              `}
            >{d?.day}</button>
          ))}
        </div>
      </div>
    )
  }

  if (success) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Заявка отправлена!</h2>
        <p className="text-gray-500 mb-2">Мы свяжемся с вами для подтверждения</p>
        <p className="text-gray-400 text-sm mb-6">Студия {studioId} · {checkIn} — {checkOut} · {totalPrice.toLocaleString()} ₽</p>
        <a href="/bookings" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">Мои бронирования</a>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href={"/studios/" + studioId} className="text-gray-600 hover:text-blue-600 text-sm">← Назад к студии</a>
      </header>

      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Бронирование</h1>
        <p className="text-gray-500 mb-6">{studioNames[studioId]} · {price.toLocaleString()} ₽/сутки</p>

        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth()-1))} className="p-2 hover:bg-gray-100 rounded-lg">←</button>
            <span className="text-sm font-medium text-gray-600">Выберите даты заезда и выезда</span>
            <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1))} className="p-2 hover:bg-gray-100 rounded-lg">→</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderCalendar(currentMonth)}
            {renderCalendar(new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1))}
          </div>
          <div className="flex gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded inline-block"></span> Занято</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-600 rounded inline-block"></span> Выбрано</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 rounded inline-block"></span> Период</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Детали бронирования</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Заезд</label>
              <p className="font-semibold text-gray-800">{checkIn || "Не выбрано"}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">Выезд</label>
              <p className="font-semibold text-gray-800">{checkOut || "Не выбрано"}</p>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-2 block">Гостей</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests(Math.max(1, guests-1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center">−</button>
              <span className="font-semibold text-gray-800 w-6 text-center">{guests}</span>
              <button onClick={() => setGuests(Math.min(6, guests+1))} className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 flex items-center justify-center">+</button>
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-500 mb-1 block">Комментарий</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Пожелания, вопросы..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-20 focus:outline-none focus:border-blue-400" />
          </div>
          {nights >= 2 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{price.toLocaleString()} ₽ × {nights} ночей</span>
                <span className="font-semibold">{totalPrice.toLocaleString()} ₽</span>
              </div>
              {guests > 2 && (
                <div className="flex justify-between text-sm text-orange-600">
                  <span>Доплата за {guests-2} доп. гостя</span>
                  <span>+{((guests-2)*1000*nights).toLocaleString()} ₽</span>
                </div>
              )}
            </div>
          )}
          <button onClick={handleSubmit} disabled={submitting || !checkIn || !checkOut || nights < 2} className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition">
            {submitting ? "Отправка..." : `Забронировать за ${totalPrice.toLocaleString()} ₽`}
          </button>
        </div>
      </div>
    </main>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>}>
      <BookingPageInner />
    </Suspense>
  )
}