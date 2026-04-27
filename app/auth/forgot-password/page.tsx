"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/auth/reset-password",
    })
    setLoading(false)
    if (error) { setError("Ошибка: " + error.message); return }
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <a href="/auth/login" className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-sm mb-6">← Назад</a>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Восстановление пароля</h1>
        <p className="text-gray-500 text-sm mb-6">Введите email — мы отправим ссылку для сброса пароля</p>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
        {sent ? (
          <div className="bg-green-50 text-green-700 px-4 py-4 rounded-lg text-sm text-center">
            <p className="font-semibold mb-1">Письмо отправлено! ✉️</p>
            <p>Проверьте почту и перейдите по ссылке для сброса пароля</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Email</label>
              <input type="email" placeholder="your@email.com" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
            </div>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-2 disabled:opacity-50">
              {loading ? "Отправка..." : "Отправить ссылку"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}