import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const BOT_TOKEN = "8781534240:AAHmbhPE2cKWTOSKuzMQNp19ZIfzk5dGKjc"
const ADMIN_ID = "5585749093"

const studioNames: Record<number, string> = { 1: "Студия 1 — Уютная", 2: "Студия 2 — Современная", 3: "Студия 3 — Премиум" }

async function sendTelegram(text: string) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: ADMIN_ID, text, parse_mode: "Markdown" })
    })
  } catch (e) {
    console.error("Telegram error:", e)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, studio_id, check_in, check_out, guests, total_price, comment } = await request.json()

    const { data: conflict } = await supabase
      .from("bookings")
      .select("id")
      .eq("studio_id", studio_id)
      .eq("status", "confirmed")
      .or(`check_in.lte.${check_out},check_out.gte.${check_in}`)

    if (conflict && conflict.length > 0) {
      return NextResponse.json({ error: "Студия уже занята в выбранные даты" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([{ user_id, studio_id, check_in, check_out, guests, total_price, comment, status: "pending" }])
      .select("*, users(name, phone)")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Считаем количество ночей
    const nights = Math.ceil((new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 60 * 60 * 24))

    // Отправляем уведомление в Telegram
    await sendTelegram(
      `🔔 *Новая заявка на бронь!*\n\n` +
      `🏠 ${studioNames[studio_id]}\n` +
      `👤 Гость: ${data.users?.name || "Не указано"}\n` +
      `📞 Телефон: ${data.users?.phone || "Не указано"}\n` +
      `📅 Заезд: ${check_in}\n` +
      `📅 Выезд: ${check_out}\n` +
      `🌙 Ночей: ${nights}\n` +
      `👥 Гостей: ${guests}\n` +
      `💰 Сумма: ${total_price.toLocaleString()} ₽\n` +
      (comment ? `💬 Комментарий: ${comment}\n` : "") +
      `\n_Перейдите в админ панель для подтверждения_`
    )

    return NextResponse.json({ success: true, booking: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studio_id = searchParams.get("studio_id")
  const { data } = await supabase
    .from("bookings")
    .select("check_in, check_out")
    .eq("studio_id", studio_id)
    .in("status", ["pending", "confirmed"])
  return NextResponse.json({ bookings: data || [] })
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status } = await request.json()
    const { data: booking } = await supabase
      .from("bookings")
      .select("*, users(name, phone)")
      .eq("id", id)
      .single()

    if (!booking) return NextResponse.json({ error: "Бронь не найдена" }, { status: 404 })

    await supabase.from("bookings").update({ status }).eq("id", id)

    if (status === "confirmed") {
      await supabase.from("finances").insert([{
        type: "income",
        category: "Бронирование",
        amount: booking.total_price,
        description: `${studioNames[booking.studio_id]} — ${booking.users?.name} (${booking.check_in} — ${booking.check_out})`,
        studio_id: booking.studio_id,
        date: new Date().toISOString().split("T")[0],
      }])
      await supabase.from("studio_status").update({ status: "busy" }).eq("studio_id", booking.studio_id)

      // Уведомление о подтверждении
      await sendTelegram(
        `✅ *Бронь подтверждена!*\n\n` +
        `🏠 ${studioNames[booking.studio_id]}\n` +
        `👤 ${booking.users?.name}\n` +
        `📅 ${booking.check_in} — ${booking.check_out}\n` +
        `💰 ${booking.total_price.toLocaleString()} ₽`
      )
    }

    if (status === "cancelled") {
      await supabase.from("finances")
        .delete()
        .eq("category", "Бронирование")
        .eq("studio_id", booking.studio_id)
        .eq("amount", booking.total_price)
      await supabase.from("studio_status").update({ status: "free" }).eq("studio_id", booking.studio_id)

      // Уведомление об отмене
      await sendTelegram(
        `❌ *Бронь отменена*\n\n` +
        `🏠 ${studioNames[booking.studio_id]}\n` +
        `👤 ${booking.users?.name}\n` +
        `📅 ${booking.check_in} — ${booking.check_out}`
      )
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}