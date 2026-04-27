"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [form, setForm] = useState({ password: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (form.password !== form.confirm) { setError("Пароли не совпадают"); return }
    if (form.password.length < 6) { setError("Минимум 6 символов"); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: form.password })
    setLoading(false)
    if (error) { setError("Ошибка: " + error.message); return }
    router.push("/auth/login")
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Новый пароль</h1>
        <p className="text-gray-500 text-sm mb-6">Придумайте новый пароль для входа</p>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Новый пароль</label>
            <input type="password" placeholder="Минимум 6 символов" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Повторите пароль</label>
            <input type="password" placeholder="Повторите пароль" required value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-2 disabled:opacity-50">
            {loading ? "Сохранение..." : "Сохранить пароль"}
          </button>
        </form>
      </div>
    </main>
  )
}