import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const { data } = await supabase.from("studios").select("price, name, description").eq("id", id).single()
  if (!data) return NextResponse.json({ error: "Не найдено" }, { status: 404 })
  return NextResponse.json(data)
}