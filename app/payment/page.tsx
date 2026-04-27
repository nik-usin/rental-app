"use client"
import SideMenu from "@/components/SideMenu"
import { FaPhone } from "react-icons/fa"
import { useLang } from "@/components/LangProvider"

export default function PaymentPage() {
  const { t, lang } = useLang()

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/studios" className="text-gray-600 hover:text-blue-600 text-sm">← {lang === "ru" ? "Назад" : "Back"}</a>
      </header>

      <div className="max-w-2xl mx-auto py-10 px-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{t("payment.title")}</h1>
          <p className="text-gray-500">{t("payment.subtitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">⚡</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{lang === "ru" ? "СБП — Система быстрых платежей" : "Fast Payment System"}</h2>
              <p className="text-gray-400 text-sm">{lang === "ru" ? "Перевод по номеру телефона через любой банк" : "Transfer by phone number via any bank"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { bank: lang === "ru" ? "Сбербанк" : "Sberbank", phone: "+7 *** *** ** **", color: "bg-green-50 border-green-200 text-green-700" },
              { bank: lang === "ru" ? "Тинькофф" : "Tinkoff", phone: "+7 *** *** ** **", color: "bg-yellow-50 border-yellow-200 text-yellow-700" },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between px-5 py-4 rounded-xl border ${item.color}`}>
                <div>
                  <p className="font-semibold text-sm">{item.bank}</p>
                  <p className="text-lg font-bold mt-0.5">{item.phone}</p>
                </div>
                <FaPhone size={18} />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">💳</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{lang === "ru" ? "Перевод на карту" : "Card transfer"}</h2>
              <p className="text-gray-400 text-sm">{lang === "ru" ? "Переведите на номер карты через приложение банка" : "Transfer to card number via banking app"}</p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { bank: lang === "ru" ? "Сбербанк" : "Sberbank", card: "**** **** **** ****" },
              { bank: lang === "ru" ? "Тинькофф" : "Tinkoff", card: "**** **** **** ****" },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-5 py-4 border border-gray-100">
                <p className="text-gray-500 text-sm mb-1">{item.bank}</p>
                <p className="text-gray-800 font-bold text-lg tracking-widest">{item.card}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">👤</span>
            <h2 className="text-lg font-bold text-gray-800">{t("payment.recipient")}</h2>
          </div>
          <p className="text-gray-700 font-medium">* * * * * * * * * *</p>
          <p className="text-gray-400 text-sm mt-1">{lang === "ru" ? "Убедитесь что имя получателя совпадает при переводе" : "Make sure the recipient name matches when transferring"}</p>
        </div>

        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h2 className="font-bold text-blue-800 mb-3">📋 {lang === "ru" ? "После оплаты" : "After payment"}</h2>
          <ol className="flex flex-col gap-2 text-blue-700 text-sm">
            {lang === "ru" ? (
              <>
                <li>1. Сделайте скриншот чека об оплате</li>
                <li>2. Напишите нам в Telegram или WhatsApp</li>
                <li>3. Отправьте скриншот и укажите даты бронирования</li>
                <li>4. Мы подтвердим бронь в течение суток</li>
              </>
            ) : (
              <>
                <li>1. Take a screenshot of the payment receipt</li>
                <li>2. Contact us via Telegram or WhatsApp</li>
                <li>3. Send the screenshot and your booking dates</li>
                <li>4. We will confirm your booking within 24 hours</li>
              </>
            )}
          </ol>
          <div className="flex gap-3 mt-4">
            <a href="https://t.me/ваш_ник" className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600">✈️ Telegram</a>
            <a href="https://wa.me/79262343017" className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-600">💬 WhatsApp</a>
          </div>
        </div>
      </div>
    </main>
  )
}