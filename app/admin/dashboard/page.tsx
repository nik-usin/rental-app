"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import SideMenu from "@/components/SideMenu"

function PromotionsTab({ showMsg }: { showMsg: (m: string) => void }) {
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newPromo, setNewPromo] = useState({ title: "", description: "", discount_percent: "", min_nights: "1", color: "#2563EB", icon: "🎉", active: true })

  useEffect(() => { fetchPromotions() }, [])

  const fetchPromotions = async () => {
    const res = await fetch("/api/promotions")
    const data = await res.json()
    setPromotions(data.promotions || [])
    setLoading(false)
  }

  const addPromotion = async () => {
    if (!newPromo.title || !newPromo.discount_percent) return
    await fetch("/api/promotions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newPromo, discount_percent: Number(newPromo.discount_percent), min_nights: Number(newPromo.min_nights) }) })
    setNewPromo({ title: "", description: "", discount_percent: "", min_nights: "1", color: "#2563EB", icon: "🎉", active: true })
    fetchPromotions()
    showMsg("Акция добавлена!")
  }

  const toggleActive = async (id: number, active: boolean) => {
    await fetch("/api/promotions", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active: !active }) })
    fetchPromotions()
    showMsg(active ? "Акция деактивирована" : "Акция активирована!")
  }

  const deletePromotion = async (id: number) => {
    if (!confirm("Удалить акцию?")) return
    await fetch("/api/promotions", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) })
    fetchPromotions()
    showMsg("Акция удалена!")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="font-bold text-gray-800 text-lg mb-4">➕ Новая акция</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          <input value={newPromo.title} onChange={e => setNewPromo({...newPromo, title: e.target.value})} placeholder="Название акции*" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
          <input value={newPromo.description} onChange={e => setNewPromo({...newPromo, description: e.target.value})} placeholder="Описание" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
          <input type="number" value={newPromo.discount_percent} onChange={e => setNewPromo({...newPromo, discount_percent: e.target.value})} placeholder="Скидка %*" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
          <input type="number" value={newPromo.min_nights} onChange={e => setNewPromo({...newPromo, min_nights: e.target.value})} placeholder="Мин. ночей" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
          <div className="flex gap-2 items-center">
            <input value={newPromo.icon} onChange={e => setNewPromo({...newPromo, icon: e.target.value})} placeholder="Иконка" className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
            <input type="color" value={newPromo.color} onChange={e => setNewPromo({...newPromo, color: e.target.value})} className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer" />
          </div>
        </div>
        <button onClick={addPromotion} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Добавить акцию</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-lg">Список акций</h2>
          <a href="/promotions" target="_blank" className="text-blue-600 text-sm hover:underline">Страница акций →</a>
        </div>
        {loading ? <p className="text-gray-400 text-sm">Загрузка...</p> : promotions.length === 0 ? <p className="text-gray-400 text-sm">Акций пока нет</p> : (
          <div className="flex flex-col gap-4">
            {promotions.map(p => (
              <div key={p.id} className={`rounded-2xl border-2 p-5 ${p.active ? "border-gray-100" : "border-dashed border-gray-200 opacity-60"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{p.icon}</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-800">{p.title}</h3>
                        <span className="font-bold text-lg" style={{color: p.color}}>-{p.discount_percent}%</span>
                        {p.min_nights > 1 && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">от {p.min_nights} ночей</span>}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{p.active ? "Активна" : "Неактивна"}</span>
                      </div>
                      <p className="text-gray-500 text-sm">{p.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => toggleActive(p.id, p.active)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${p.active ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>{p.active ? "Деактивировать" : "Активировать"}</button>
                    <button onClick={() => deletePromotion(p.id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition">Удалить</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tab, setTab] = useState<"overview"|"analytics"|"studios"|"bookings"|"finances"|"clients"|"tasks"|"reviews"|"documents"|"promotions"|"export">("overview")
  const [studios, setStudios] = useState<any[]>([])
  const [studioStatuses, setStudioStatuses] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [finances, setFinances] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [blacklist, setBlacklist] = useState<any[]>([])
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [newFinance, setNewFinance] = useState({ type: "income", category: "Бронирование", amount: "", description: "", studio_id: "", date: new Date().toISOString().split("T")[0] })
  const [newTask, setNewTask] = useState({ title: "", description: "", studio_id: "", due_date: "" })
  const [newBlacklist, setNewBlacklist] = useState({ name: "", phone: "", email: "", reason: "" })
  const [exportFrom, setExportFrom] = useState("")
  const [exportTo, setExportTo] = useState("")
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (!saved) { router.push("/auth/login"); return }
    const u = JSON.parse(saved)
    if (u.role !== "admin") { router.push("/"); return }
    setUser(u)
    fetchAll()
  }, [])

  const fetchAll = async () => {
    setLoading(true)
    const [s, ss, b, r, f, c, bl, t] = await Promise.all([
      supabase.from("studios").select("*").order("id"),
      supabase.from("studio_status").select("*").order("studio_id"),
      supabase.from("bookings").select("*, users(name, phone, email)").order("created_at", { ascending: false }),
      supabase.from("reviews").select("*, users(name)").order("created_at", { ascending: false }),
      supabase.from("finances").select("*").order("date", { ascending: false }),
      supabase.from("users").select("*").eq("role", "user").order("created_at", { ascending: false }),
      supabase.from("blacklist").select("*").order("created_at", { ascending: false }),
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
    ])
    setStudios(s.data || [])
    setStudioStatuses(ss.data || [])
    setBookings(b.data || [])
    setReviews(r.data || [])
    setFinances(f.data || [])
    setClients(c.data || [])
    setBlacklist(bl.data || [])
    setTasks(t.data || [])
    setLoading(false)
  }

  const showMsg = (msg: string) => { setMessage(msg); setTimeout(() => setMessage(""), 3000) }
  const handleLogout = () => { localStorage.removeItem("user"); router.push("/") }

  const handleExport = async () => {
    setExporting(true)
    const params = new URLSearchParams()
    if (exportFrom) params.set("from", exportFrom)
    if (exportTo) params.set("to", exportTo)
    const res = await fetch(`/api/export?${params.toString()}`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `отчёт_${exportFrom || "начало"}_${exportTo || "конец"}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      showMsg("Файл Excel скачан!")
    }
    setExporting(false)
  }

  const updateStudioPrice = async (id: number, price: number) => {
    await supabase.from("studios").update({ price }).eq("id", id)
    setStudios(studios.map(s => s.id === id ? { ...s, price } : s))
    showMsg("Цена обновлена!")
  }

  const updateStudioStatus = async (id: number, status: string) => {
    await supabase.from("studio_status").update({ status, updated_at: new Date().toISOString() }).eq("studio_id", id)
    setStudioStatuses(studioStatuses.map(s => s.studio_id === id ? { ...s, status } : s))
    showMsg("Статус обновлён!")
  }

  const updateBookingStatus = async (id: number, status: string) => {
    await fetch("/api/bookings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) })
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b))
    await fetchAll()
    showMsg("Статус брони обновлён!")
  }

  const deleteBooking = async (id: number) => {
    if (!confirm("Удалить бронь?")) return
    await supabase.from("bookings").delete().eq("id", id)
    setBookings(bookings.filter(b => b.id !== id))
    showMsg("Бронь удалена!")
  }

  const deleteReview = async (id: number) => {
    if (!confirm("Удалить отзыв?")) return
    await supabase.from("reviews").delete().eq("id", id)
    setReviews(reviews.filter(r => r.id !== id))
    showMsg("Отзыв удалён!")
  }

  const addFinance = async () => {
    if (!newFinance.amount) return
    const { data } = await supabase.from("finances").insert([{ ...newFinance, amount: Number(newFinance.amount), studio_id: newFinance.studio_id ? Number(newFinance.studio_id) : null }]).select().single()
    if (data) setFinances([data, ...finances])
    setNewFinance({ type: "income", category: "Бронирование", amount: "", description: "", studio_id: "", date: new Date().toISOString().split("T")[0] })
    showMsg("Запись добавлена!")
  }

  const deleteFinance = async (id: number) => {
    await supabase.from("finances").delete().eq("id", id)
    setFinances(finances.filter(f => f.id !== id))
  }

  const addToBlacklist = async () => {
    if (!newBlacklist.name || !newBlacklist.reason) return
    const { data } = await supabase.from("blacklist").insert([newBlacklist]).select().single()
    if (data) setBlacklist([data, ...blacklist])
    setNewBlacklist({ name: "", phone: "", email: "", reason: "" })
    showMsg("Добавлено в чёрный список!")
  }

  const removeFromBlacklist = async (id: number) => {
    await supabase.from("blacklist").delete().eq("id", id)
    setBlacklist(blacklist.filter(b => b.id !== id))
  }

  const deleteUser = async (id: number, name: string) => {
    if (!confirm(`Удалить пользователя ${name}? Все его брони и отзывы тоже будут удалены!`)) return
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
    if (res.ok) {
      setClients(clients.filter(c => c.id !== id))
      showMsg(`Пользователь ${name} удалён!`)
    }
  }

  const addTask = async () => {
    if (!newTask.title) return
    const { data } = await supabase.from("tasks").insert([{ ...newTask, studio_id: newTask.studio_id ? Number(newTask.studio_id) : null }]).select().single()
    if (data) setTasks([data, ...tasks])
    setNewTask({ title: "", description: "", studio_id: "", due_date: "" })
    showMsg("Задача добавлена!")
  }

  const toggleTask = async (id: number, status: string) => {
    const newStatus = status === "done" ? "pending" : "done"
    await supabase.from("tasks").update({ status: newStatus }).eq("id", id)
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t))
  }

  const deleteTask = async (id: number) => {
    await supabase.from("tasks").delete().eq("id", id)
    setTasks(tasks.filter(t => t.id !== id))
  }

  const studioNames: Record<number, string> = { 1: "Студия 1", 2: "Студия 2", 3: "Студия 3" }
  const statusColors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-green-100 text-green-700", cancelled: "bg-red-100 text-red-600" }
  const statusNames: Record<string, string> = { pending: "Ожидает", confirmed: "Подтверждено", cancelled: "Отменено" }
  const studioStatusColors: Record<string, string> = { free: "bg-green-100 text-green-700", busy: "bg-red-100 text-red-600", cleaning: "bg-yellow-100 text-yellow-700", repair: "bg-gray-100 text-gray-600" }
  const studioStatusNames: Record<string, string> = { free: "Свободна", busy: "Занята", cleaning: "Уборка", repair: "Ремонт" }

  const totalIncome = finances.filter(f => f.type === "income").reduce((s, f) => s + f.amount, 0)
  const totalExpense = finances.filter(f => f.type === "expense").reduce((s, f) => s + f.amount, 0)
  const profit = totalIncome - totalExpense
  const todayBookings = bookings.filter(b => b.check_in === new Date().toISOString().split("T")[0])
  const pendingBookings = bookings.filter(b => b.status === "pending")

  const months = ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"]
  const currentYear = new Date().getFullYear()
  const monthlyData = months.map((month, i) => {
    const monthIncome = finances.filter(f => { const d = new Date(f.date); return f.type === "income" && d.getMonth() === i && d.getFullYear() === currentYear }).reduce((s, f) => s + f.amount, 0)
    const monthExpense = finances.filter(f => { const d = new Date(f.date); return f.type === "expense" && d.getMonth() === i && d.getFullYear() === currentYear }).reduce((s, f) => s + f.amount, 0)
    const monthBookings = bookings.filter(b => { const d = new Date(b.created_at); return d.getMonth() === i && d.getFullYear() === currentYear }).length
    return { month, income: monthIncome, expense: monthExpense, profit: monthIncome - monthExpense, bookings: monthBookings }
  })

  const maxIncome = Math.max(...monthlyData.map(m => m.income), 1)

  const studioBookings = [1, 2, 3].map(id => ({
    id, name: studioNames[id],
    total: bookings.filter(b => b.studio_id === id).length,
    confirmed: bookings.filter(b => b.studio_id === id && b.status === "confirmed").length,
    revenue: finances.filter(f => f.studio_id === id && f.type === "income").reduce((s, f) => s + f.amount, 0),
    avgRating: reviews.filter(r => r.studio_id === id).length > 0
      ? (reviews.filter(r => r.studio_id === id).reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.studio_id === id).length).toFixed(1)
      : "—"
  }))

  const tabs = [
    { key: "overview", label: "📊 Обзор" },
    { key: "analytics", label: "📈 Аналитика" },
    { key: "studios", label: "🏠 Студии" },
    { key: "bookings", label: "📅 Брони" },
    { key: "finances", label: "💰 Финансы" },
    { key: "clients", label: "👥 Клиенты" },
    { key: "tasks", label: "✅ Задачи" },
    { key: "reviews", label: "⭐ Отзывы" },
    { key: "documents", label: "📄 Документы" },
    { key: "promotions", label: "🎉 Акции" },
    { key: "export", label: "📥 Excel" },
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <div className="flex items-center gap-4">
          <a href="/profile" className="text-gray-600 hover:text-blue-600 text-sm">👤 Администратор</a>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm">Выйти</button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto py-8 px-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Панель администратора</h1>
        {message && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">{message}</div>}

        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)} className={`px-4 py-2 rounded-xl font-medium text-sm transition ${tab === t.key ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "overview" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Всего броней", value: bookings.length, icon: "📅", color: "text-blue-600" },
                { label: "Ожидают подтверждения", value: pendingBookings.length, icon: "⏳", color: "text-yellow-600" },
                { label: "Заездов сегодня", value: todayBookings.length, icon: "🔑", color: "text-green-600" },
                { label: "Клиентов", value: clients.length, icon: "👥", color: "text-purple-600" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-5">
                  <p className="text-2xl mb-2">{item.icon}</p>
                  <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-gray-500 text-sm mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl shadow-sm p-5"><p className="text-gray-500 text-sm mb-1">Доходы</p><p className="text-2xl font-bold text-green-600">+{totalIncome.toLocaleString()} ₽</p></div>
              <div className="bg-white rounded-2xl shadow-sm p-5"><p className="text-gray-500 text-sm mb-1">Расходы</p><p className="text-2xl font-bold text-red-500">-{totalExpense.toLocaleString()} ₽</p></div>
              <div className="bg-white rounded-2xl shadow-sm p-5"><p className="text-gray-500 text-sm mb-1">Прибыль</p><p className={`text-2xl font-bold ${profit >= 0 ? "text-blue-600" : "text-red-500"}`}>{profit.toLocaleString()} ₽</p></div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Статусы студий</h2>
              <div className="grid grid-cols-3 gap-4">
                {studios.map(s => {
                  const st = studioStatuses.find(ss => ss.studio_id === s.id)
                  return (
                    <div key={s.id} className="bg-gray-50 rounded-xl p-4">
                      <p className="font-semibold text-gray-800 text-sm mb-2">{s.name}</p>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${studioStatusColors[st?.status || "free"]}`}>{studioStatusNames[st?.status || "free"]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Ближайшие задачи</h2>
              {tasks.filter(t => t.status === "pending").slice(0, 3).length === 0
                ? <p className="text-gray-400 text-sm">Задач нет</p>
                : tasks.filter(t => t.status === "pending").slice(0, 3).map(t => (
                  <div key={t.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <span className="text-yellow-500">⏳</span>
                    <p className="text-gray-700 text-sm">{t.title}</p>
                    {t.due_date && <span className="text-gray-400 text-xs ml-auto">{t.due_date}</span>}
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === "analytics" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-6">Сравнение студий</h2>
              <div className="grid grid-cols-3 gap-4">
                {studioBookings.map(s => (
                  <div key={s.id} className="bg-gray-50 rounded-2xl p-5">
                    <h3 className="font-bold text-gray-800 mb-4">{s.name}</h3>
                    <div className="flex flex-col gap-3">
                      <div><p className="text-gray-400 text-xs">Всего броней</p><p className="text-2xl font-bold text-blue-600">{s.total}</p></div>
                      <div><p className="text-gray-400 text-xs">Подтверждённых</p><p className="text-xl font-bold text-green-600">{s.confirmed}</p></div>
                      <div><p className="text-gray-400 text-xs">Выручка</p><p className="text-xl font-bold text-purple-600">{s.revenue.toLocaleString()} ₽</p></div>
                      <div><p className="text-gray-400 text-xs">Рейтинг</p><p className="text-xl font-bold text-yellow-500">⭐ {s.avgRating}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-2">Доходы по месяцам ({currentYear})</h2>
              <div className="flex items-end gap-2 h-48">
                {monthlyData.map((m, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-xs text-gray-500">{m.income > 0 ? `${(m.income/1000).toFixed(0)}к` : ""}</p>
                    <div className="w-full relative flex flex-col justify-end" style={{height: "140px"}}>
                      <div className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600" style={{height: `${maxIncome > 0 ? (m.income / maxIncome) * 140 : 4}px`, minHeight: "4px"}} title={`${m.month}: ${m.income.toLocaleString()} ₽`} />
                    </div>
                    <p className="text-xs text-gray-400">{m.month}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Статистика по месяцам</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-gray-500 font-medium">Месяц</th>
                      <th className="text-right py-3 text-gray-500 font-medium">Доход</th>
                      <th className="text-right py-3 text-gray-500 font-medium">Расход</th>
                      <th className="text-right py-3 text-gray-500 font-medium">Прибыль</th>
                      <th className="text-right py-3 text-gray-500 font-medium">Броней</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthlyData.map((m, i) => (
                      <tr key={i} className={`border-b border-gray-50 ${i === new Date().getMonth() ? "bg-blue-50" : ""}`}>
                        <td className="py-3 font-medium text-gray-800">{m.month} {i === new Date().getMonth() ? <span className="text-blue-500 text-xs">← сейчас</span> : ""}</td>
                        <td className="py-3 text-right text-green-600 font-medium">{m.income > 0 ? `+${m.income.toLocaleString()} ₽` : "—"}</td>
                        <td className="py-3 text-right text-red-500">{m.expense > 0 ? `-${m.expense.toLocaleString()} ₽` : "—"}</td>
                        <td className={`py-3 text-right font-bold ${m.profit > 0 ? "text-blue-600" : m.profit < 0 ? "text-red-500" : "text-gray-400"}`}>{m.profit !== 0 ? `${m.profit > 0 ? "+" : ""}${m.profit.toLocaleString()} ₽` : "—"}</td>
                        <td className="py-3 text-right text-gray-600">{m.bookings > 0 ? m.bookings : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-200">
                      <td className="py-3 font-bold text-gray-800">Итого</td>
                      <td className="py-3 text-right font-bold text-green-600">+{totalIncome.toLocaleString()} ₽</td>
                      <td className="py-3 text-right font-bold text-red-500">-{totalExpense.toLocaleString()} ₽</td>
                      <td className={`py-3 text-right font-bold ${profit >= 0 ? "text-blue-600" : "text-red-500"}`}>{profit.toLocaleString()} ₽</td>
                      <td className="py-3 text-right font-bold text-gray-600">{bookings.length}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-2">Загруженность студий</h2>
              {[1, 2, 3].map(studioId => {
                const now = new Date()
                const year = now.getFullYear()
                const month = now.getMonth()
                const daysInMonth = new Date(year, month + 1, 0).getDate()
                const firstDay = new Date(year, month, 1).getDay()
                const startOffset = firstDay === 0 ? 6 : firstDay - 1
                const studioBookingDates = bookings.filter(b => b.studio_id === studioId && b.status !== "cancelled").flatMap(b => {
                  const dates = []
                  const cur = new Date(b.check_in)
                  const end = new Date(b.check_out)
                  while (cur < end) { dates.push(cur.toISOString().split("T")[0]); cur.setDate(cur.getDate() + 1) }
                  return dates
                })
                const days = []
                for (let i = 0; i < startOffset; i++) days.push(null)
                for (let d = 1; d <= daysInMonth; d++) {
                  const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`
                  days.push({ day: d, date: dateStr, busy: studioBookingDates.includes(dateStr) })
                }
                const busyDays = days.filter(d => d && d.busy).length
                const occupancy = Math.round((busyDays / daysInMonth) * 100)
                return (
                  <div key={studioId} className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">{studioNames[studioId]}</h3>
                      <span className={`text-sm font-bold ${occupancy > 70 ? "text-green-600" : occupancy > 30 ? "text-yellow-600" : "text-gray-400"}`}>Загруженность: {occupancy}%</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 mb-1">
                      {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map(d => <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((d, i) => (
                        <div key={i} className={`h-8 rounded-lg flex items-center justify-center text-xs font-medium ${!d ? "" : d.busy ? "bg-red-400 text-white" : "bg-gray-100 text-gray-600"} ${d?.date === now.toISOString().split("T")[0] ? "ring-2 ring-blue-500" : ""}`}>
                          {d?.day}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded inline-block"></span> Занято ({busyDays} дн.)</span>
                      <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded inline-block"></span> Свободно ({daysInMonth - busyDays} дн.)</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {tab === "studios" && (
          <div className="flex flex-col gap-4">
            {studios.map(s => {
              const st = studioStatuses.find(ss => ss.studio_id === s.id)
              return (
                <div key={s.id} className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">{s.name}</h3>
                      <p className="text-gray-500 text-sm mt-1">{s.description}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <input type="number" defaultValue={s.price} onBlur={e => updateStudioPrice(s.id, Number(e.target.value))} className="w-28 border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 focus:outline-none focus:border-blue-400" />
                        <span className="text-gray-500 text-sm">₽/сут</span>
                      </div>
                      <select value={st?.status || "free"} onChange={e => updateStudioStatus(s.id, e.target.value)} className={`border rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none ${studioStatusColors[st?.status || "free"]}`}>
                        <option value="free">Свободна</option>
                        <option value="busy">Занята</option>
                        <option value="cleaning">Уборка</option>
                        <option value="repair">Ремонт</option>
                      </select>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {tab === "bookings" && (
          <div className="flex flex-col gap-4">
            {bookings.length === 0 && <p className="text-gray-400 text-center py-8">Броней пока нет</p>}
            {bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="font-bold text-gray-800">{studioNames[b.studio_id]}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[b.status] || "bg-gray-100 text-gray-600"}`}>{statusNames[b.status] || b.status}</span>
                    </div>
                    <p className="text-gray-600 text-sm">👤 {b.users?.name} · {b.users?.phone}</p>
                    <p className="text-gray-600 text-sm mt-1">📅 {b.check_in} — {b.check_out} · 👥 {b.guests} гостей</p>
                    <p className="text-blue-600 font-semibold text-sm mt-1">💰 {b.total_price?.toLocaleString()} ₽</p>
                    {b.comment && <p className="text-gray-400 text-sm mt-1">💬 {b.comment}</p>}
                  </div>
                  <div className="flex flex-col gap-2">
                    <select value={b.status} onChange={e => updateBookingStatus(b.id, e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                      <option value="pending">Ожидает</option>
                      <option value="confirmed">Подтвердить</option>
                      <option value="cancelled">Отменить</option>
                    </select>
                    <button onClick={() => deleteBooking(b.id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition">Удалить</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "finances" && (
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-gray-500 text-sm">Доходы</p><p className="text-2xl font-bold text-green-600 mt-1">+{totalIncome.toLocaleString()} ₽</p></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-gray-500 text-sm">Расходы</p><p className="text-2xl font-bold text-red-500 mt-1">-{totalExpense.toLocaleString()} ₽</p></div>
              <div className="bg-white rounded-2xl p-5 shadow-sm"><p className="text-gray-500 text-sm">Прибыль</p><p className={`text-2xl font-bold mt-1 ${profit >= 0 ? "text-blue-600" : "text-red-500"}`}>{profit.toLocaleString()} ₽</p></div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Добавить запись</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                <select value={newFinance.type} onChange={e => setNewFinance({...newFinance, type: e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="income">Доход</option>
                  <option value="expense">Расход</option>
                </select>
                <input value={newFinance.category} onChange={e => setNewFinance({...newFinance, category: e.target.value})} placeholder="Категория" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <input type="number" value={newFinance.amount} onChange={e => setNewFinance({...newFinance, amount: e.target.value})} placeholder="Сумма ₽" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <input value={newFinance.description} onChange={e => setNewFinance({...newFinance, description: e.target.value})} placeholder="Описание" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <input type="date" value={newFinance.date} onChange={e => setNewFinance({...newFinance, date: e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <select value={newFinance.studio_id} onChange={e => setNewFinance({...newFinance, studio_id: e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">Все студии</option>
                  <option value="1">Студия 1</option>
                  <option value="2">Студия 2</option>
                  <option value="3">Студия 3</option>
                </select>
              </div>
              <button onClick={addFinance} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Добавить</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">История</h2>
              {finances.length === 0 && <p className="text-gray-400 text-sm">Записей пока нет</p>}
              <div className="flex flex-col gap-3">
                {finances.map(f => (
                  <div key={f.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={`text-lg ${f.type === "income" ? "text-green-500" : "text-red-500"}`}>{f.type === "income" ? "↑" : "↓"}</span>
                      <div>
                        <p className="text-gray-800 text-sm font-medium">{f.category} {f.description && `— ${f.description}`}</p>
                        <p className="text-gray-400 text-xs">{f.date} {f.studio_id && `· ${studioNames[f.studio_id]}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${f.type === "income" ? "text-green-600" : "text-red-500"}`}>{f.type === "income" ? "+" : "-"}{f.amount.toLocaleString()} ₽</span>
                      <button onClick={() => deleteFinance(f.id)} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "clients" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Все клиенты ({clients.length})</h2>
              {clients.length === 0 && <p className="text-gray-400 text-sm">Клиентов пока нет</p>}
              <div className="flex flex-col gap-3">
                {clients.map(c => {
                  const clientBookings = bookings.filter(b => b.user_id === c.id)
                  const isBlacklisted = blacklist.some(b => b.email === c.email || b.phone === c.phone)
                  return (
                    <div key={c.id} className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${isBlacklisted ? "opacity-50" : ""}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
                          {isBlacklisted && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">ЧС</span>}
                        </div>
                        <p className="text-gray-400 text-xs mt-0.5">{c.phone} · {c.email}</p>
                        <p className="text-gray-400 text-xs">Броней: {clientBookings.length}</p>
                      </div>
                      <div className="flex gap-2">
                        {!isBlacklisted && (
                          <button onClick={() => setNewBlacklist({...newBlacklist, name: c.name, phone: c.phone || "", email: c.email})} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50">+ В ЧС</button>
                        )}
                        <button onClick={() => deleteUser(c.id, c.name)} className="text-xs text-red-600 hover:text-red-800 font-semibold px-2 py-1 rounded-lg hover:bg-red-50">🗑 Удалить</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">🚫 Чёрный список</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <input value={newBlacklist.name} onChange={e => setNewBlacklist({...newBlacklist, name: e.target.value})} placeholder="Имя*" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <input value={newBlacklist.phone} onChange={e => setNewBlacklist({...newBlacklist, phone: e.target.value})} placeholder="Телефон" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <input value={newBlacklist.email} onChange={e => setNewBlacklist({...newBlacklist, email: e.target.value})} placeholder="Email" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <input value={newBlacklist.reason} onChange={e => setNewBlacklist({...newBlacklist, reason: e.target.value})} placeholder="Причина*" className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <button onClick={addToBlacklist} className="bg-red-500 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 mb-4">Добавить в ЧС</button>
              {blacklist.length === 0 && <p className="text-gray-400 text-sm">Чёрный список пуст</p>}
              <div className="flex flex-col gap-3">
                {blacklist.map(b => (
                  <div key={b.id} className="flex items-center justify-between bg-red-50 rounded-xl p-4">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{b.name}</p>
                      <p className="text-gray-500 text-xs">{b.phone} {b.email}</p>
                      <p className="text-red-500 text-xs mt-1">Причина: {b.reason}</p>
                    </div>
                    <button onClick={() => removeFromBlacklist(b.id)} className="text-gray-300 hover:text-red-400">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "tasks" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Новая задача</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <input value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} placeholder="Название*" className="col-span-2 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
                <select value={newTask.studio_id} onChange={e => setNewTask({...newTask, studio_id: e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400">
                  <option value="">Все студии</option>
                  <option value="1">Студия 1</option>
                  <option value="2">Студия 2</option>
                  <option value="3">Студия 3</option>
                </select>
                <input type="date" value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400" />
              </div>
              <button onClick={addTask} className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700">Добавить</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-4">Список задач</h2>
              {tasks.length === 0 && <p className="text-gray-400 text-sm">Задач нет</p>}
              <div className="flex flex-col gap-3">
                {tasks.map(t => (
                  <div key={t.id} className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${t.status === "done" ? "opacity-50" : ""}`}>
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTask(t.id, t.status)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${t.status === "done" ? "bg-green-500 border-green-500 text-white" : "border-gray-300"}`}>
                        {t.status === "done" && "✓"}
                      </button>
                      <div>
                        <p className={`text-sm font-medium ${t.status === "done" ? "line-through text-gray-400" : "text-gray-800"}`}>{t.title}</p>
                        <p className="text-gray-400 text-xs">{t.studio_id && `${studioNames[t.studio_id]} · `}{t.due_date}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteTask(t.id)} className="text-gray-300 hover:text-red-400">✕</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="flex flex-col gap-4">
            {reviews.length === 0 && <p className="text-gray-400 text-center py-8">Отзывов пока нет</p>}
            {reviews.map(r => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-800">{r.users?.name}</h3>
                      <span className="text-sm text-gray-500">{studioNames[r.studio_id]}</span>
                      <span className="text-yellow-400">{"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{r.text}</p>
                    <p className="text-gray-400 text-xs mt-2">{new Date(r.created_at).toLocaleDateString("ru")}</p>
                  </div>
                  <button onClick={() => deleteReview(r.id)} className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg text-sm">Удалить</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "documents" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="font-bold text-gray-800 mb-2">📄 Генерация документов</h2>
              <p className="text-gray-500 text-sm mb-6">Выберите подтверждённое бронирование</p>
              {bookings.filter(b => b.status === "confirmed").length === 0
                ? <p className="text-gray-400 text-sm">Нет подтверждённых броней</p>
                : bookings.filter(b => b.status === "confirmed").map(b => (
                  <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{studioNames[b.studio_id]} — {b.users?.name}</p>
                      <p className="text-gray-400 text-xs">{b.check_in} — {b.check_out} · {b.total_price?.toLocaleString()} ₽</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const text = `ДОГОВОР АРЕНДЫ\n\nСтудия: ${studioNames[b.studio_id]}\nГость: ${b.users?.name}\nТелефон: ${b.users?.phone}\nДаты: ${b.check_in} — ${b.check_out}\nГостей: ${b.guests}\nСумма: ${b.total_price?.toLocaleString()} ₽\n\nДата: ${new Date().toLocaleDateString("ru")}`
                        const blob = new Blob([text], {type: "text/plain"})
                        const a = document.createElement("a")
                        a.href = URL.createObjectURL(blob); a.download = `Договор_${b.users?.name}_${b.check_in}.txt`; a.click()
                      }} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg text-xs font-medium">📄 Договор</button>
                      <button onClick={() => {
                        const text = `ЧЕК ОБ ОПЛАТЕ\n\nСтудия: ${studioNames[b.studio_id]}\nГость: ${b.users?.name}\nДаты: ${b.check_in} — ${b.check_out}\nСумма: ${b.total_price?.toLocaleString()} ₽\nДата: ${new Date().toLocaleDateString("ru")}\n\nСтудии «На холмах»`
                        const blob = new Blob([text], {type: "text/plain"})
                        const a = document.createElement("a")
                        a.href = URL.createObjectURL(blob); a.download = `Чек_${b.users?.name}_${b.check_in}.txt`; a.click()
                      }} className="bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg text-xs font-medium">🧾 Чек</button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {tab === "promotions" && <PromotionsTab showMsg={showMsg} />}

        {tab === "export" && (
          <div className="flex flex-col gap-6">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">📥</span>
                <h2 className="font-bold text-gray-800 text-xl">Экспорт в Excel</h2>
              </div>
              <p className="text-gray-500 text-sm mb-8">Выберите период и скачайте отчёт с бронированиями и финансами</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Дата начала периода</label>
                  <input type="date" value={exportFrom} onChange={e => setExportFrom(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Дата конца периода</label>
                  <input type="date" value={exportTo} onChange={e => setExportTo(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400" />
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mb-8">
                <button onClick={() => { const now = new Date(); setExportFrom(new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0]); setExportTo(now.toISOString().split("T")[0]) }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 font-medium">Текущий месяц</button>
                <button onClick={() => { const now = new Date(); setExportFrom(new Date(now.getFullYear(), now.getMonth()-1, 1).toISOString().split("T")[0]); setExportTo(new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split("T")[0]) }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 font-medium">Прошлый месяц</button>
                <button onClick={() => { const now = new Date(); setExportFrom(new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0]); setExportTo(now.toISOString().split("T")[0]) }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 font-medium">Весь год</button>
                <button onClick={() => { setExportFrom(""); setExportTo("") }} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 font-medium">Всё время</button>
              </div>
              <button onClick={handleExport} disabled={exporting} className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-lg transition flex items-center justify-center gap-3">
                {exporting ? <><span className="animate-spin">⏳</span> Создаём файл...</> : <><span>📥</span> Скачать Excel файл</>}
              </button>
              {exportFrom && exportTo && <p className="text-center text-gray-400 text-sm mt-4">Период: {new Date(exportFrom).toLocaleDateString("ru")} — {new Date(exportTo).toLocaleDateString("ru")}</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}