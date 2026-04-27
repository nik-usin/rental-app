"use client"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

export default function AboutPage() {
  const { t, lang } = useLang()

  const features = lang === "ru" ? [
    { icon: "🏠", label: "3 студии" },
    { icon: "🔑", label: "Бесконтактное заселение" },
    { icon: "📅", label: "От 2 дней" },
    { icon: "⭐", label: "С 2022 года" },
  ] : [
    { icon: "🏠", label: "3 studios" },
    { icon: "🔑", label: "Contactless check-in" },
    { icon: "📅", label: "From 2 days" },
    { icon: "⭐", label: "Since 2022" },
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
        <p className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-3">{t("about.title")}</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{lang === "ru" ? "На холмах" : "Na Holmah"}</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">{t("about.subtitle")}</p>
      </section>

      <section className="max-w-4xl mx-auto py-16 px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-blue-600 font-semibold uppercase tracking-widest text-sm mb-3">{lang === "ru" ? "Мы предлагаем" : "We offer"}</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{lang === "ru" ? "3 комфортабельные студии" : "3 comfortable studios"}</h2>
          <p className="text-gray-500 leading-relaxed">
            {lang === "ru"
              ? <>Мы работаем с <span className="font-semibold text-gray-700">2022 года</span> и предлагаем услуги комфортного проживания с бесконтактным заселением в апартаментах, расположенных в ЖК «Изумрудные Холмы».</>
              : <>We have been operating since <span className="font-semibold text-gray-700">2022</span> and offer comfortable accommodation with contactless check-in in apartments located in the Izumrudnye Holmy complex.</>
            }
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {features.map((item, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-5 text-center">
              <div className="text-3xl mb-2">{item.icon}</div>
              <p className="text-gray-700 font-medium text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-blue-600 text-white py-16 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 max-w-2xl mx-auto">
          {lang === "ru" ? "Мы рады Вам и всегда ждём Вас снова" : "We are glad to welcome you and look forward to your return"}
        </h2>
        <p className="text-blue-100 max-w-xl mx-auto leading-relaxed">
          {lang === "ru"
            ? "Мы предоставляем три студии для проживания с комфортом и всеми удобствами. Минимальный срок — от двух дней."
            : "We provide three studios for comfortable living with all amenities. Minimum stay — two days."}
        </p>
      </section>

      <section className="py-16 px-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{lang === "ru" ? "Готовы к заселению?" : "Ready to check in?"}</h2>
        <p className="text-gray-500 mb-8">{lang === "ru" ? "Выберите студию и забронируйте онлайн за пару минут" : "Choose a studio and book online in minutes"}</p>
        <a href="/studios" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-700 inline-block">{t("studios.title")}</a>
      </section>
    </main>
  )
}