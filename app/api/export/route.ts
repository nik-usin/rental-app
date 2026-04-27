import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import * as XLSX from "xlsx"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dateFrom = searchParams.get("from")
  const dateTo = searchParams.get("to")

  // Получаем бронирования за период
  let bookingsQuery = supabase
    .from("bookings")
    .select("*, users(name, phone, email)")
    .order("created_at", { ascending: false })

  if (dateFrom) bookingsQuery = bookingsQuery.gte("check_in", dateFrom)
  if (dateTo) bookingsQuery = bookingsQuery.lte("check_out", dateTo)

  const { data: bookings } = await bookingsQuery

  // Получаем финансы за период
  let financesQuery = supabase
    .from("finances")
    .select("*")
    .order("date", { ascending: false })

  if (dateFrom) financesQuery = financesQuery.gte("date", dateFrom)
  if (dateTo) financesQuery = financesQuery.lte("date", dateTo)

  const { data: finances } = await financesQuery

  // Создаём Excel файл
  const wb = XLSX.utils.book_new()

  // Лист 1 — Бронирования
  const bookingsData = (bookings || []).map(b => ({
    "ID": b.id,
    "Студия": b.studio_id === 1 ? "Студия 1" : b.studio_id === 2 ? "Студия 2" : "Студия 3",
    "Клиент": b.users?.name || "—",
    "Телефон": b.users?.phone || "—",
    "Email": b.users?.email || "—",
    "Заезд": b.check_in,
    "Выезд": b.check_out,
    "Гостей": b.guests,
    "Сумма (₽)": b.total_price,
    "Статус": b.status === "confirmed" ? "Подтверждено" : b.status === "cancelled" ? "Отменено" : "Ожидает",
    "Комментарий": b.comment || "—",
    "Дата создания": new Date(b.created_at).toLocaleDateString("ru-RU"),
  }))

  const ws1 = XLSX.utils.json_to_sheet(bookingsData)
  ws1["!cols"] = [
    {wch: 5}, {wch: 15}, {wch: 20}, {wch: 15}, {wch: 25},
    {wch: 12}, {wch: 12}, {wch: 8}, {wch: 12}, {wch: 15}, {wch: 25}, {wch: 15}
  ]
  XLSX.utils.book_append_sheet(wb, ws1, "Бронирования")

  // Лист 2 — Финансы
  const financesData = (finances || []).map(f => ({
    "ID": f.id,
    "Тип": f.type === "income" ? "Доход" : "Расход",
    "Категория": f.category,
    "Сумма (₽)": f.amount,
    "Описание": f.description || "—",
    "Дата": f.date,
  }))

  const ws2 = XLSX.utils.json_to_sheet(financesData)
  ws2["!cols"] = [{wch: 5}, {wch: 10}, {wch: 20}, {wch: 12}, {wch: 30}, {wch: 12}]
  XLSX.utils.book_append_sheet(wb, ws2, "Финансы")

  // Лист 3 — Итого
  const totalIncome = (finances || []).filter(f => f.type === "income").reduce((sum, f) => sum + f.amount, 0)
  const totalExpense = (finances || []).filter(f => f.type === "expense").reduce((sum, f) => sum + f.amount, 0)
  const totalBookings = (bookings || []).reduce((sum, b) => sum + b.total_price, 0)

  const summaryData = [
    { "Показатель": "Период с", "Значение": dateFrom || "—" },
    { "Показатель": "Период по", "Значение": dateTo || "—" },
    { "Показатель": "Всего броней", "Значение": (bookings || []).length },
    { "Показатель": "Подтверждено", "Значение": (bookings || []).filter(b => b.status === "confirmed").length },
    { "Показатель": "Отменено", "Значение": (bookings || []).filter(b => b.status === "cancelled").length },
    { "Показатель": "Сумма броней (₽)", "Значение": totalBookings },
    { "Показатель": "Доходы (₽)", "Значение": totalIncome },
    { "Показатель": "Расходы (₽)", "Значение": totalExpense },
    { "Показатель": "Прибыль (₽)", "Значение": totalIncome - totalExpense },
  ]

  const ws3 = XLSX.utils.json_to_sheet(summaryData)
  ws3["!cols"] = [{wch: 25}, {wch: 20}]
  XLSX.utils.book_append_sheet(wb, ws3, "Итого")

  // Генерируем файл
  const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })
  const fileName = `отчёт_${dateFrom || "начало"}_${dateTo || "конец"}.xlsx`

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  })
}