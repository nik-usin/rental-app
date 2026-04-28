"use client"
import { useEffect, useState } from "react"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

export default function PromotionsPage() {
  const { lang } = useLang()
  const [promotions, setPromotions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/promotions")
      .then(r => r.json())
      .then(d => { setPromotions(d.promotions.filter((p: any) => p.active)); setLoading(false) })
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/studios" className="text-gray-600 hover:text-blue-600 text-sm">← {lang === "ru" ? "Студии" : "Studios"}</a>
      </header>

      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <p className="text-yellow-400 uppercase tracking-widest text-sm font-semibold mb-3">🎉 {lang === "ru" ? "Специальные предложения" : "Special offers"}</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{lang === "ru" ? "Акции и скидки" : "Promotions"}</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">{lang === "ru" ? "Выгодные предложения для наших гостей" : "Great deals for our guests"}</p>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-6">
        {loading ? (
          <div className="text-center text-gray-400">{lang === "ru" ? "Загрузка..." : "Loading..."}</div>
        ) : promotions.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-4xl mb-4">🎁</p>
            <p className="text-lg font-semibold text-gray-600">{lang === "ru" ? "Акций пока нет" : "No promotions yet"}</p>
            <p className="text-gray-400 text-sm mt-2">{lang === "ru" ? "Следите за обновлениями!" : "Stay tuned!"}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {promotions.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition">
                <div className="p-1" style={{backgroundColor: p.color}}>
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-4xl">{p.icon}</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold" style={{color: p.color}}>-{p.discount_percent}%</span>
                        {p.min_nights > 1 && (
                          <p className="text-gray-400 text-xs mt-1">{lang === "ru" ? `от ${p.min_nights} ночей` : `from ${p.min_nights} nights`}</p>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{p.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{p.description}</p>
                    <a href="/studios" className="inline-block text-white px-6 py-2 rounded-lg font-semibold text-sm hover:opacity-90 transition" style={{backgroundColor: p.color}}>
                      {lang === "ru" ? "Забронировать со скидкой" : "Book with discount"}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-blue-50 py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{lang === "ru" ? "Как получить скидку?" : "How to get a discount?"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {(lang === "ru" ? [
              { icon: "📅", text: "Выберите даты согласно условиям акции" },
              { icon: "🏠", text: "Забронируйте студию онлайн" },
              { icon: "💰", text: "Скидка применится автоматически" },
            ] : [
              { icon: "📅", text: "Choose dates according to the promotion terms" },
              { icon: "🏠", text: "Book a studio online" },
              { icon: "💰", text: "Discount will be applied automatically" },
            ]).map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-4">
                <p className="text-3xl mb-2">{step.icon}</p>
                <p className="text-gray-600 text-sm">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}