import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const studio_id = searchParams.get("studio_id")
  const { data } = await supabase
    .from("reviews")
    .select("*, users(name)")
    .eq("studio_id", studio_id)
    .order("created_at", { ascending: false })
  return NextResponse.json({ reviews: data || [] })
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, studio_id, rating, text } = await request.json()
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user_id)
      .eq("studio_id", studio_id)
      .single()
    if (existing) return NextResponse.json({ error: "Вы уже оставляли отзыв об этой студии" }, { status: 400 })
    const { data, error } = await supabase
      .from("reviews")
      .insert([{ user_id, studio_id, rating, text }])
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true, review: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}