import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single()

  if (!user) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return NextResponse.json({ error: "Неверный email или пароль" }, { status: 401 })
  }

  return NextResponse.json({ success: true, user })
}