import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const user_id = searchParams.get("user_id")
  const all = searchParams.get("all")

  if (all === "true") {
    const { data } = await supabase
      .from("messages")
      .select("*, users(name, email)")
      .order("created_at", { ascending: true })
    return NextResponse.json({ messages: data || [] })
  }

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: true })
  return NextResponse.json({ messages: data || [] })
}

export async function POST(request: NextRequest) {
  const { user_id, text, sender } = await request.json()
  const { data, error } = await supabase
    .from("messages")
    .insert([{ user_id, text, sender }])
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: data })
}

export async function PATCH(request: NextRequest) {
  const { id, text } = await request.json()
  const { data, error } = await supabase
    .from("messages")
    .update({ text, edited: true, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ message: data })
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  await supabase.from("messages").delete().eq("id", id)
  return NextResponse.json({ success: true })
}