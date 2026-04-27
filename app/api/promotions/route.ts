import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data } = await supabase.from("promotions").select("*").order("discount_percent", { ascending: true })
  return NextResponse.json({ promotions: data || [] })
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { data, error } = await supabase.from("promotions").insert([body]).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promotion: data })
}

export async function PATCH(request: NextRequest) {
  const { id, ...updates } = await request.json()
  const { data, error } = await supabase.from("promotions").update(updates).eq("id", id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ promotion: data })
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json()
  await supabase.from("promotions").delete().eq("id", id)
  return NextResponse.json({ success: true })
}