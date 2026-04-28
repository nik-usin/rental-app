"use client"
import SideMenu from "@/components/SideMenu"
import ChatBot from "@/components/ChatBot"
import { useLang } from "@/components/LangProvider"

export default function ChatPage() {
  const { lang } = useLang()
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/" className="text-gray-600 hover:text-blue-600 text-sm">← {lang === "ru" ? "Назад" : "Back"}</a>
      </header>
      <div className="max-w-2xl mx-auto py-10 px-6 text-center">
        <div className="text-5xl mb-4">🤖</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{lang === "ru" ? "Чат-помощник" : "Chat Assistant"}</h1>
        <p className="text-gray-500 mb-8">{lang === "ru" ? "Задайте любой вопрос о студиях, бронировании или оплате" : "Ask any question about studios, booking or payment"}</p>
        <div className="bg-white rounded-2xl shadow-sm p-4 text-left">
          <p className="text-gray-400 text-sm text-center">{lang === "ru" ? "Нажмите на кнопку 💬 в правом нижнем углу чтобы открыть чат" : "Click the 💬 button in the bottom right corner to open chat"}</p>
        </div>
      </div>
      <ChatBot />
    </main>
  )
}