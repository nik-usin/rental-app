"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import SideMenu from "@/components/SideMenu"

const studiosData = [
  {
    id: 1,
    name: "Студия 1 — Уютная",
    price: "5 000 / сутки",
    area: "23 м²",
    floor: "2 из 25",
    guests: "До 3 гостей",
    features: ["🛋 Диван-кровать", "🛏 Раскладной пуфик", "📺 Wink", "🍳 Варочная панель", "🌐 Wi-Fi", "❄️ Холодильник", "👕 Стиральная машина", "📦 Микроволновка", "🔑 Электронный замок", "🛗 Лифт"],
    description: "Уютная дизайнерская студия в новом ЖК ждёт своих гостей. Для бесконтактного самостоятельного заселения в любое время суток на двери установлен электронный кодовый замок. Квартира укомплектована всей необходимой для проживания мебелью и техникой. Рядом с домом в пешей доступности расположены супермаркеты, аптеки, кафе и рестораны, большое количество учебных заведений. В пешей доступности от дома расположен лесопарк «Изумрудные холмы». Подходит для семьи с ребёнком, есть дополнительное раскладное спальное место.",
    extra: "Цена указана за 2 гостей. Доплата за каждого доп. гостя — 1 000 ₽/сутки. При бронировании от 10 суток — скидки.",
    beds: "1 двуспальный диван-кровать + 1 раскладной пуфик (80×190 см)",
    photos: Array.from({length: 28}, (_, i) => `/studios/studio1/__1_${String(i+1).padStart(2,"00")}.jpg`),
  },
  {
    id: 2,
    name: "Студия 2 — Современная",
    price: "6 500 / сутки",
    area: "20 м²",
    floor: "2 из 25",
    guests: "До 2 гостей",
    features: ["🛏 Откидная кровать", "📺 Wink", "🍳 Варочная панель", "🌐 Wi-Fi", "❄️ Холодильник", "👕 Стиральная машина", "📦 Микроволновка", "🔑 Электронный замок", "🛗 Лифт"],
    description: "Уютная дизайнерская студия в новом ЖК ждёт своих гостей. Для бесконтактного самостоятельного заселения в любое время суток на двери установлен электронный кодовый замок. Студия укомплектована всей необходимой для проживания мебелью и техникой. Рядом с домом расположены супермаркеты, аптеки, кафе и рестораны. Совсем рядом расположен лесопарк «Изумрудные холмы». Также в пешей доступности госпиталь на улице Светлая.",
    extra: "Цена указана за 2 гостей. При бронировании от 10 суток — скидки.",
    beds: "1 откидная двуспальная кровать",
    photos: Array.from({length: 28}, (_, i) => `/studios/studio2/__2_${String(i+1).padStart(2,"00")}.jpg`),
  },
  {
    id: 3,
    name: "Студия 3 — Премиум",
    price: "9 000 / сутки",
    area: "26 м²",
    floor: "2 из 25",
    guests: "До 4 гостей",
    features: ["🛏 Двуспальная кровать", "🛋 Диван-кровать", "📺 Wink", "🍳 Варочная панель", "🌐 Wi-Fi", "❄️ Холодильник", "👕 Стиральная машина", "📦 Микроволновка", "🔑 Электронный замок", "🛗 Лифт"],
    description: "Уютная дизайнерская квартира в новом ЖК ждёт своих гостей. 1 спальня + кухонная зона. Для бесконтактного самостоятельного заселения в любое время суток на двери установлен электронный кодовый замок. Студия укомплектована всей необходимой для проживания мебелью и техникой. Рядом с домом расположены супермаркеты, аптеки, кафе и рестораны, большое количество учебных заведений. Совсем рядом лесопарк «Изумрудные холмы». Также в пешей доступности госпиталь на улице Светлая.",
    extra: "Цена указана за 2 гостей. Доплата за каждого доп. гостя — 1 000 ₽/сутки. При бронировании от 10 суток — скидки.",
    beds: "1 двуспальная кровать + 1 двуспальный диван-кровать",
    photos: Array.from({length: 29}, (_, i) => `/studios/studio3/__3_${String(i+1).padStart(2,"00")}.jpg`),
  },
]

function Gallery({ photos }: { photos: string[] }) {
  const [current, setCurrent] = useState(0)
  const [showAll, setShowAll] = useState(false)
  const visiblePhotos = showAll ? photos : photos.slice(0, 9)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setCurrent(i => (i - 1 + photos.length) % photos.length)
      if (e.key === "ArrowRight") setCurrent(i => (i + 1) % photos.length)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [photos.length])

  return (
    <div className="mb-10">
      <div className="relative bg-gray-900 rounded-2xl overflow-hidden" style={{height: "480px"}}>
        <Image src={photos[current]} alt={"Фото " + (current+1)} fill className="object-contain" />
        <button onClick={() => setCurrent(i => (i - 1 + photos.length) % photos.length)} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg transition">‹</button>
        <button onClick={() => setCurrent(i => (i + 1) % photos.length)} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg transition">›</button>
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-4">
          {photos.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition ${i === current ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-3 py-1 rounded-full">{current + 1} / {photos.length}</div>
      </div>
      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
        {visiblePhotos.map((photo, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${i === current ? "border-blue-500" : "border-transparent"}`}>
            <Image src={photo} alt={"Миниатюра " + (i+1)} fill className="object-cover" loading="lazy" />
          </button>
        ))}
        {!showAll && photos.length > 9 && (
          <button onClick={() => setShowAll(true)} className="flex-shrink-0 w-16 h-16 rounded-lg border-2 border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-500 hover:bg-gray-100 transition">
            +{photos.length - 9}
          </button>
        )}
      </div>
    </div>
  )
}

export default function StudioPage() {
  const params = useParams()
  const [user, setUser] = useState<any>(null)
  const [studioPrice, setStudioPrice] = useState<number | null>(null)
  const studio = studiosData.find(s => s.id === Number(params.id))

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) setUser(JSON.parse(saved))
    if (studio) fetchPrice(studio.id)
  }, [])

  const fetchPrice = async (id: number) => {
    const res = await fetch(`/api/studios/${id}`)
    if (res.ok) {
      const data = await res.json()
      setStudioPrice(data.price)
    }
  }

  if (!studio) return <div className="p-8 text-center text-gray-500">Студия не найдена</div>

  const displayPrice = studioPrice ? `${studioPrice.toLocaleString("ru-RU")} / сутки` : studio.price

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/studios" className="text-gray-600 hover:text-blue-600">Назад к студиям</a>
      </header>

      <section className="max-w-4xl mx-auto py-10 px-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-1">{studio.name}</h1>
              <p className="text-blue-600 font-semibold text-2xl mb-3">{displayPrice} ₽</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { icon: "📐", label: studio.area },
                  { icon: "🏢", label: "Этаж " + studio.floor },
                  { icon: "👥", label: studio.guests },
                  { icon: "🛏", label: studio.beds },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                    <span>{item.icon}</span>
                    <span className="text-gray-700 text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed mb-4">{studio.description}</p>
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl px-4 py-3 text-blue-800 dark:text-blue-200 text-sm mb-4">{studio.extra}</div>
          <div>
            <p className="text-sm text-gray-500 mb-2 font-medium">Удобства:</p>
            <div className="flex flex-wrap gap-2">
              {studio.features.map((f, i) => (
                <span key={i} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">{f}</span>
              ))}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4">Фотографии</h2>
        <Gallery photos={studio.photos} />

        <h2 className="text-xl font-bold text-gray-800 mb-4">Как добраться</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div>
            <p className="text-gray-500 text-sm mb-2">Как дойти до дома</p>
            <video controls className="w-full rounded-xl" src="https://rzkpvdqrfsbkzpobangr.supabase.co/storage/v1/object/public/videos/2Kak-Doyti.mp4" />
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-2">Как зайти в подъезд</p>
            <video controls className="w-full rounded-xl" src="https://rzkpvdqrfsbkzpobangr.supabase.co/storage/v1/object/public/videos/Kak-Zayti.mp4" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Забронировать</h2>
          <p className="text-gray-500 text-sm mb-4">Выберите даты и оформите заявку онлайн</p>
          {user ? (
            <a href={"/booking?studio=" + studio.id} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
              Выбрать даты и забронировать
            </a>
          ) : (
            <div>
              <p className="text-gray-500 text-sm mb-3">Для бронирования необходимо войти в аккаунт</p>
              <a href="/auth/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 inline-block">
                Войти и забронировать
              </a>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Отзывы гостей</h2>
          <p className="text-gray-500 text-sm mb-4">Читайте отзывы и делитесь своим опытом</p>
          <a href={"/reviews?studio=" + studio.id} className="bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-900 inline-block">
            Читать отзывы
          </a>
        </div>
      </section>
    </main>
  )
}