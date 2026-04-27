import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { data } = await supabase.from("studios").select("price, name, description").eq("id", params.id).single()
  if (!data) return NextResponse.json({ error: "Не найдено" }, { status: 404 })
  return NextResponse.json(data)
}