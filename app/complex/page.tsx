"use client"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

export default function ComplexPage() {
  const { t, lang } = useLang()

  const stats = lang === "ru" ? [
    { num: "5", label: "Минут пешком от автобусной остановки" },
    { num: "2", label: "Этаж в жилом комплексе" },
    { num: "от 20", label: "Квадратных метров площадь студии" },
    { num: "3", label: "Студии мы предлагаем" },
  ] : [
    { num: "5", label: "Minutes walk from bus stop" },
    { num: "2", label: "Floor in the complex" },
    { num: "from 20", label: "Square meters studio area" },
    { num: "3", label: "Studios available" },
  ]

  const infrastructure = lang === "ru" ? [
    { icon: "🌲", title: "Природа", text: "Рядом с комплексом находится лес и несколько водоёмов", url: "https://yandex.ru/maps/?text=Изумрудные+холмы+Красногорск" },
    { icon: "🔒", title: "Безопасность", text: "Видеонаблюдение, закрытая территория и бесконтактный электронный пропуск", url: "https://izumrudnye-holmy.ru" },
    { icon: "🚌", title: "Транспортная доступность", text: "Рядом автобусная остановка Карбышева", url: "https://yandex.ru/maps/?text=остановка+Карбышева+Красногорск" },
    { icon: "🚗", title: "Паркинг и кладовые", text: "Аренда машиноместа в подземных паркингах и бесплатные места на поверхности", url: "https://izumrudnye-holmy.ru" },
    { icon: "🏡", title: "Благоустроенный двор", text: "Детская площадка, спортплощадка, беседки, цветники и места для отдыха", url: "https://izumrudnye-holmy.ru" },
  ] : [
    { icon: "🌲", title: "Nature", text: "Forest and several water bodies near the complex", url: "https://yandex.ru/maps/?text=Изумрудные+холмы+Красногорск" },
    { icon: "🔒", title: "Security", text: "CCTV, gated territory and contactless electronic access", url: "https://izumrudnye-holmy.ru" },
    { icon: "🚌", title: "Transport", text: "Karbysheva bus stop nearby", url: "https://yandex.ru/maps/?text=остановка+Карбышева+Красногорск" },
    { icon: "🚗", title: "Parking & storage", text: "Underground parking rental and free surface spots", url: "https://izumrudnye-holmy.ru" },
    { icon: "🏡", title: "Landscaped yard", text: "Playground, sports area, gazebos, flower beds and rest areas", url: "https://izumrudnye-holmy.ru" },
  ]

  const studios = [
    { name: lang === "ru" ? "Студия № 1" : "Studio #1", area: lang === "ru" ? "От 23 м²" : "From 23 m²", id: 1, photo: "/studios/studio1/__1_01.jpg" },
    { name: lang === "ru" ? "Студия № 2" : "Studio #2", area: lang === "ru" ? "От 20 м²" : "From 20 m²", id: 2, photo: "/studios/studio2/__1_01.jpg" },
    { name: lang === "ru" ? "Студия № 3" : "Studio #3", area: lang === "ru" ? "От 26 м²" : "From 26 m²", id: 3, photo: "/studios/studio3/__3_01.jpg" },
  ]

  const news = lang === "ru" ? [
    { title: "Новости Административного округа Красногорск", url: "https://krasnogorsk-adm.ru" },
    { title: "Красногорский округ", url: "https://krasnogorsk.ru" },
    { title: "Администрация городского округа Красногорск Московской области", url: "https://krasnogorsk-adm.ru" },
  ] : [
    { title: "News of Krasnogorsk Administrative District", url: "https://krasnogorsk-adm.ru" },
    { title: "Krasnogorsk District", url: "https://krasnogorsk.ru" },
    { title: "Administration of Krasnogorsk, Moscow Region", url: "https://krasnogorsk-adm.ru" },
  ]

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/studios" className="text-gray-600 hover:text-blue-600 text-sm">{t("nav.studios")}</a>
      </header>

      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <p className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-3">{t("complex.title")}</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">«{lang === "ru" ? "Изумрудные холмы" : "Izumrudnye Holmy"}»</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">{lang === "ru" ? "Студии расположены в современном жилом комплексе с развитой инфраструктурой" : "Studios located in a modern residential complex with developed infrastructure"}</p>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6">
              <p className="text-4xl font-bold text-blue-600 mb-2">{item.num}</p>
              <p className="text-gray-500 text-sm leading-snug">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-blue-600 uppercase tracking-widest text-sm font-semibold mb-3">{lang === "ru" ? "О студиях" : "About studios"}</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">{lang === "ru" ? "Уют в каждой детали" : "Comfort in every detail"}</h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            {lang === "ru"
              ? "Наши студии расположены в тихом, уединённом районе города с чистой экологией. Рядом — всё необходимое для комфортного проживания: магазин, спортзал и уютное кафе."
              : "Our studios are located in a quiet, secluded area of the city with clean ecology. Nearby — everything you need: a store, gym and cozy cafe."}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t("complex.infrastructure")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {infrastructure.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-300 hover:shadow-md transition">
              <span className="text-3xl mt-0.5">{item.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">{lang === "ru" ? "Планировки наших студий" : "Our studio layouts"}</h2>
          <p className="text-gray-500 text-center mb-8">{lang === "ru" ? "Просторные студии со всеми удобствами. Современный евроремонт." : "Spacious studios with all amenities. Modern renovation."}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studios.map((s) => (
              <a key={s.id} href={"/studios/" + s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100">
                <div className="relative h-40 w-full bg-gray-200">
                  <img src={s.photo} alt={s.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-gray-800 mb-1">{s.name}</h3>
                  <p className="text-blue-600 font-semibold">{s.area}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">{lang === "ru" ? "Последние новости" : "Latest news"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {news.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="bg-gray-50 rounded-2xl p-5 border border-gray-100 hover:border-blue-200 hover:shadow-sm transition">
              <p className="text-gray-700 font-medium text-sm mb-3 leading-snug">{item.title}</p>
              <span className="text-blue-600 text-sm font-semibold">{lang === "ru" ? "Подробнее →" : "Read more →"}</span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}