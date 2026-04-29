import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data } = await supabase.from("users").select("id, name, email, phone").eq("role", "user").order("name")
  return NextResponse.json({ users: data || [] })
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: "ID не указан" }, { status: 400 })
    await supabase.from("bookings").delete().eq("user_id", id)
    await supabase.from("reviews").delete().eq("user_id", id)
    const { error } = await supabase.from("users").delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}