"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [checking, setChecking] = useState(true)
  const { t } = useLang()

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <span className="text-xl font-bold text-blue-600">КвартираСуток</span>
        </div>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/profile" className="text-gray-600 hover:text-blue-600 text-sm">{t("studios.hello")}, {user.name}!</Link>
              <Link href="/studios" className="text-gray-600 hover:text-blue-600 text-sm">{t("nav.studios")}</Link>
              <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm">{t("nav.logout")}</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 text-sm">{t("auth.login_btn")}</Link>
              <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">{t("auth.register_btn")}</Link>
            </>
          )}
        </div>
      </header>

      <section className="bg-gray-900 text-white py-24 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{t("home.hero_title")}</h1>
        <p className="text-gray-300 text-xl mb-8">{t("home.hero_subtitle")}</p>
        <Link href={user ? "/studios" : "/auth/register"} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 inline-block">
          {t("home.book_btn")}
        </Link>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">{t("home.why_title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: "🏠", title: t("home.f1_title"), text: t("home.f1_text") },
            { icon: "📅", title: t("home.f2_title"), text: t("home.f2_text") },
            { icon: "✅", title: t("home.f3_title"), text: t("home.f3_text") },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-6 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t("home.contact_title")}</h2>
        <p className="text-gray-500 mb-4">{t("home.contact_subtitle")}</p>
        <div className="flex gap-4 justify-center">
          <a href="https://t.me/ваш_ник" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 inline-flex items-center gap-2">
            <FaTelegramPlane size={20} /> {t("home.telegram_btn")}
          </a>
          <a href="https://wa.me/79262343017" className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 inline-flex items-center gap-2">
            <FaWhatsapp size={20} /> {t("home.whatsapp_btn")}
          </a>
        </div>
      </section>
    </main>
  )
}
