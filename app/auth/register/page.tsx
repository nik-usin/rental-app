"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/register", {
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
      setSuccess(true)
      setTimeout(() => router.push("/studios"), 2000)
    }
  }

  if (success) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Добро пожаловать!</h2>
        <p className="text-gray-500 mb-2">Регистрация прошла успешно</p>
        <p className="text-gray-400 text-sm">Переходим к студиям...</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-400 hover:text-blue-600 text-sm mb-6">
          ← Назад
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Регистрация</h1>
        <p className="text-gray-500 text-sm mb-6">Создайте аккаунт чтобы забронировать студию</p>
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Имя</label>
            <input type="text" placeholder="Ваше имя" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Телефон</label>
            <input type="tel" placeholder="+7 000 000 00 00" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input type="email" placeholder="your@email.com" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Пароль</label>
            <input type="password" placeholder="Минимум 6 символов" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-400" />
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-2 disabled:opacity-50">
            {loading ? "Загрузка..." : "Зарегистрироваться"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Уже есть аккаунт? <a href="/auth/login" className="text-blue-600 hover:underline">Войти</a>
        </p>
      </div>
    </main>
  )
}