"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    const loginTime = localStorage.getItem("loginTime")
    if (saved && loginTime) {
      const days30 = 30 * 24 * 60 * 60 * 1000
      if (Date.now() - Number(loginTime) < days30) {
        const user = JSON.parse(saved)
        if (user.role === "admin") router.push("/admin/dashboard")
        else router.push("/studios")
      } else {
        localStorage.removeItem("user")
        localStorage.removeItem("loginTime")
      }
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
    } else {
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("loginTime", String(Date.now()))
      if (data.user.role === "admin") router.push("/admin/dashboard")
      else router.push("/studios")
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-sm mb-6">
          ← Назад
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Вход</h1>
        <p className="text-gray-500 text-sm mb-6">Войдите в свой аккаунт</p>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input type="email" placeholder="your@email.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Пароль</label>
            <input type="password" placeholder="Ваш пароль" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-2 disabled:opacity-50">
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Нет аккаунта? <a href="/auth/register" className="text-blue-600 hover:underline">Зарегистрироваться</a>
        </p>
        <p className="text-center text-sm text-gray-400 mt-2">
          <a href="/admin/dashboard" className="hover:text-blue-600">Вход для администратора</a>
        </p>
        <p className="text-center text-sm text-gray-400 mt-2">
          <a href="/auth/forgot-password" className="hover:text-blue-600">Забыли пароль?</a>
        </p>
      </div>
    </main>
  )
}