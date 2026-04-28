"use client"
import SideMenu from "@/components/SideMenu"
import { FaTelegramPlane, FaWhatsapp, FaPhone } from "react-icons/fa"
import { useLang } from "@/components/LangProvider"

export default function ContactsPage() {
  const { t, lang } = useLang()

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/studios" className="text-gray-600 hover:text-blue-600 text-sm">{t("nav.studios")}</a>
      </header>

      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <p className="text-blue-400 uppercase tracking-widest text-sm font-semibold mb-3">{lang === "ru" ? "Студии «На холмах»" : "Na Holmah Studios"}</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t("contacts.title")}</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">{lang === "ru" ? "Если у Вас есть вопросы, Вы можете обратиться к нам" : "If you have any questions, feel free to contact us"}</p>
      </section>

      <section className="max-w-3xl mx-auto py-16 px-6 w-full">
        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">??</span>
            <h2 className="text-xl font-bold text-gray-800">{lang === "ru" ? "Наши телефоны" : "Our phones"}</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:+79262343017" className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition flex-1">
              <FaPhone className="text-blue-600" size={18} />
              <span className="text-gray-800 font-semibold text-lg">+7 926 234 30 17</span>
            </a>
            <a href="tel:+79161315728" className="flex items-center gap-3 bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition flex-1">
              <FaPhone className="text-blue-600" size={18} />
              <span className="text-gray-800 font-semibold text-lg">+7 916 131 57 28</span>
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">??</span>
            <h2 className="text-xl font-bold text-gray-800">{t("contacts.write_us")}</h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://t.me/naholmah_studio_bot" className="bg-blue-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-blue-600 inline-flex items-center justify-center gap-3 flex-1">
              <FaTelegramPlane size={22} /> {t("contacts.telegram")}
            </a>
            <a href="https://wa.me/79262343017" className="bg-green-500 text-white px-6 py-4 rounded-xl font-semibold hover:bg-green-600 inline-flex items-center justify-center gap-3 flex-1">
              <FaWhatsapp size={22} /> {t("contacts.whatsapp")}
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">??</span>
            <h2 className="text-xl font-bold text-gray-800">{t("contacts.address")}</h2>
          </div>
          <p className="text-gray-600">{lang === "ru" ? "ЖК «Изумрудные холмы», г. Красногорск" : "Izumrudnye Holmy Complex, Krasnogorsk"}</p>
          <p className="text-gray-400 text-sm mt-1">{lang === "ru" ? "Остановка Карбышева — 5 минут пешком" : "Karbysheva stop — 5 minutes walk"}</p>
        </div>
      </section>
    </main>
  )
}
