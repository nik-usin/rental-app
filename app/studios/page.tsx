"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import SideMenu from "@/components/SideMenu"

const studios = [
  { id: 1, name: "Студия 1 — Уютная", price: "5 000 / сутки", cover: "/studios/studio1/__1_20.jpg" },
  { id: 2, name: "Студия 2 — Современная", price: "6 500 / сутки", cover: "/studios/studio2/__1_15.jpg" },
  { id: 3, name: "Студия 3 — Премиум", price: "9 000 / сутки", cover: "/studios/studio3/__3_15.jpg" },
]

const rules = [
  { icon: "🕒", title: "Время заезда и выезда", text: "Заезд с 14:00. Выезд до 12:00. Ранний заезд и поздний выезд — по согласованию." },
  { icon: "🧼", title: "Чистота и порядок", text: "Передаём студию в чистом виде. Перед выездом вынесите мусор в баки рядом с домом. Закройте окна и выключите электроприборы." },
  { icon: "🚭", title: "Курение запрещено", text: "Курение внутри строго запрещено. Разрешено только на улице или на балконе (слева от лифта). Штраф за курение — от 3 000 руб." },
  { icon: "🐾", title: "Домашние животные", text: "Проживание с питомцами только по предварительному согласованию. Владелец отвечает за чистоту и сохранность имущества." },
  { icon: "🔇", title: "Тихие часы", text: "С 22:00 до 08:00 — режим тишины. Вечеринки запрещены. Уважайте соседей и других гостей." },
  { icon: "🛋", title: "Бережное отношение", text: "Пользуйтесь имуществом аккуратно. Если что-то сломали — сообщите нам. Утеря ключей или повреждение оборудования — штраф." },
  { icon: "🔐", title: "Безопасность", text: "Не оставляйте открытыми двери и окна. Выключайте все приборы при уходе. Не передавайте ключи третьим лицам." },
  { icon: "👥", title: "Посетители", text: "Проживают только лица, указанные при бронировании. Все гости обязаны предоставить документы. Вечеринки не допускаются." },
  { icon: "🌐", title: "Wi-Fi и техника", text: "Бесплатный Wi-Fi — пароль при заселении. Не меняйте настройки роутера. При неполадках — сообщите нам." },
  { icon: "⚠️", title: "Ответственность", text: "Грубое нарушение правил — досрочное выселение без возврата оплаты. Все повреждения оплачиваются по стоимости ремонта или замены." },
]

export default function StudiosPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) {
      setUser(JSON.parse(saved))
    } else {
      router.push("/auth/login")
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/profile" className="text-gray-600 hover:text-blue-600 text-sm">Привет, {user?.name}!</a>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm">Выйти</button>
        </div>
      </header>

      <section className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Наши студии</h1>
        <p className="text-gray-500 mb-8">Выберите студию и забронируйте онлайн</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <a key={studio.id} href={"/studios/" + studio.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="relative h-48">
                <Image src={studio.cover} alt={studio.name} fill className="object-cover" />
              </div>
              <div className="p-5">
                <h2 className="font-bold text-gray-800 text-lg mb-2">{studio.name}</h2>
                <p className="text-blue-600 font-semibold">{studio.price}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto pb-16 px-6">
        <div className="border-2 border-blue-100 rounded-2xl p-8 bg-white shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">📋</span>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Правила проживания</h2>
              <p className="text-gray-500 text-sm">Просим вас ознакомиться перед заселением</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {rules.map((rule, i) => (
              <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <span className="text-2xl mt-0.5">{rule.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{rule.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{rule.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="text-yellow-800 text-sm font-semibold mb-1">📞 Связь с нами</p>
            <p className="text-yellow-700 text-sm">Если возникли вопросы, пожелания или проблемы — мы всегда готовы помочь!</p>
            <p className="text-yellow-700 text-sm mt-2 font-medium">Благодарим за выбор наших студий! Желаем приятного проживания! 💛</p>
          </div>
        </div>
      </section>
    </main>
  )
}