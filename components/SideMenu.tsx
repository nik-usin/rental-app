"use client"
import { useState, useEffect } from "react"

export default function SideMenu() {
  const [open, setOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) {
      const u = JSON.parse(saved)
      setIsAdmin(u.role === "admin")
    }
  }, [])

  const links = [
    { href: "/", label: "🏠 Главная" },
    { href: "/studios", label: "🛋 Студии" },
    { href: "/about", label: "👋 Немного о нас" },
    { href: "/complex", label: "🏢 Жилой комплекс" },
    { href: "/contacts", label: "📞 Наши контакты" },
    { href: "/profile", label: "👤 Личный кабинет" },
    { href: "/bookings", label: "📅 Мои бронирования" },
    { href: "/payment", label: "💳 Оплата" },
  ]

  const openChat = () => {
    setOpen(false)
    const btn = document.querySelector("[data-chat-toggle]") as HTMLButtonElement
    btn?.click()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition">
        <span className="block w-6 h-0.5 bg-gray-700"></span>
        <span className="block w-6 h-0.5 bg-gray-700"></span>
        <span className="block w-6 h-0.5 bg-gray-700"></span>
      </button>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/40 z-40" />}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <span className="text-xl font-bold text-blue-600">КвартираСуток</span>
          <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <nav className="flex flex-col py-4">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition text-sm">{link.label}</a>
          ))}
          <button onClick={openChat} className="px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition text-sm text-left">
            💬 Чат-помощник
          </button>
          {isAdmin && (
            <>
              <div className="mx-6 my-2 border-t border-gray-100" />
              <a href="/admin/dashboard" onClick={() => setOpen(false)} className="px-6 py-4 text-red-600 hover:bg-red-50 font-semibold transition text-sm">
                ⚙️ Изменения
              </a>
            </>
          )}
          <div className="mx-6 my-2 border-t border-gray-100" />
          <a href="/settings" onClick={() => setOpen(false)} className="px-6 py-4 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium transition text-sm">
            ⚙️ Настройки
          </a>
        </nav>
        <div className="absolute bottom-8 left-0 right-0 px-6">
          <p className="text-gray-400 text-xs text-center">Студии «На холмах» · ЖК Изумрудные Холмы</p>
        </div>
      </div>
    </>
  )
}