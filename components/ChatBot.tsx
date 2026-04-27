"use client"
import { useState, useRef, useEffect } from "react"

const faqs = [
  { keywords: ["цена", "стоимость", "сколько", "price", "cost"], answer: "💰 Цены на студии:\n• Студия 1 (Уютная) — 5 000 ₽/сутки\n• Студия 2 (Современная) — 6 500 ₽/сутки\n• Студия 3 (Премиум) — 9 000 ₽/сутки\n\nДоплата за доп. гостя — 1 000 ₽/сутки. При бронировании от 10 суток — скидки!" },
  { keywords: ["заезд", "выезд", "заселение", "выселение", "время", "check-in", "check-out"], answer: "🕒 Время заезда и выезда:\n• Заезд с 14:00\n• Выезд до 12:00\n\nРанний заезд и поздний выезд — по согласованию с нами." },
  { keywords: ["забронировать", "бронирование", "бронь", "book", "booking"], answer: "📅 Чтобы забронировать студию:\n1. Войдите в аккаунт или зарегистрируйтесь\n2. Выберите студию в каталоге\n3. Нажмите 'Выбрать даты и забронировать'\n4. Выберите даты и количество гостей\n5. Отправьте заявку\n\nМы свяжемся для подтверждения!" },
  { keywords: ["студия", "студии", "апартамент", "квартира", "studio"], answer: "🏠 У нас 3 студии в ЖК «Изумрудные холмы»:\n• Студия 1 — Уютная (23 м², до 3 гостей)\n• Студия 2 — Современная (20 м², до 2 гостей)\n• Студия 3 — Премиум (26 м², до 4 гостей)\n\nВ каждой: Wi-Fi, стиральная машина, варочная панель, холодильник, телевизор Wink, электронный замок." },
  { keywords: ["wifi", "wi-fi", "интернет", "internet"], answer: "🌐 Да, во всех студиях есть бесплатный Wi-Fi. Пароль вы получите при заселении." },
  { keywords: ["адрес", "где", "находится", "location", "address"], answer: "📍 Наши студии находятся в ЖК «Изумрудные холмы», г. Красногорск.\n\nРядом остановка Карбышева — 5 минут пешком. Также рядом лесопарк, магазины, кафе и рестораны." },
  { keywords: ["парковка", "паркинг", "машина", "car", "parking"], answer: "🚗 Паркинг:\n• Бесплатные места на поверхности\n• Подземный паркинг — по договорённости\n\nСпросите нас при заселении!" },
  { keywords: ["животные", "кот", "собака", "питомец", "pet"], answer: "🐾 Проживание с животными возможно только по предварительному согласованию. Обратитесь к нам заранее." },
  { keywords: ["курение", "курить", "smoke", "smoking"], answer: "🚭 Курение внутри студий строго запрещено. Разрешено только на улице или на балконе (слева от лифта).\n\nШтраф за курение — от 3 000 ₽." },
  { keywords: ["контакт", "телефон", "связь", "написать", "contact", "phone"], answer: "📞 Наши контакты:\n• Телефон: +7 926 234 30 17\n• Телефон: +7 916 131 57 28\n• Telegram и WhatsApp — кнопки на главной странице\n\nИли перейдите на страницу /contacts" },
  { keywords: ["отзыв", "review", "отзывы"], answer: "⭐ Отзывы можно почитать и оставить на странице каждой студии — кнопка 'Читать отзывы'." },
  { keywords: ["скидка", "discount", "акция"], answer: "🎁 Скидки:\n• При бронировании от 10 суток — индивидуальная скидка\n• Уточняйте при бронировании!" },
  { keywords: ["лифт", "этаж", "floor", "elevator"], answer: "🛗 Студии находятся на 2 этаже из 25. В доме есть лифт." },
  { keywords: ["привет", "здравствуй", "hello", "hi", "хай"], answer: "👋 Привет! Я помощник сайта КвартираСуток. Могу помочь с:\n• Информацией о студиях и ценах\n• Вопросами о бронировании\n• Навигацией по сайту\n\nЧто вас интересует?" },
  { keywords: ["свободно", "занято", "доступно", "available", "free"], answer: "📅 Чтобы узнать доступность студии:\n1. Перейдите в каталог студий /studios\n2. Выберите нужную студию\n3. Нажмите 'Выбрать даты и забронировать'\n4. В календаре красным отмечены занятые даты, белым — свободные." },
  { keywords: ["регистрация", "аккаунт", "register", "account"], answer: "👤 Для регистрации:\n1. Нажмите 'Регистрация' в шапке сайта\n2. Введите имя, телефон, email и пароль\n3. Готово! Можете бронировать студии." },
  { keywords: ["правила", "rules"], answer: "📋 Основные правила:\n• Заезд с 14:00, выезд до 12:00\n• Курение запрещено\n• Тихие часы с 22:00 до 08:00\n• Вечеринки запрещены\n• Бережное отношение к имуществу\n\nПолные правила — на странице /studios" },
]

const quickQuestions = [
  "Сколько стоит студия?",
  "Как забронировать?",
  "Какие студии есть?",
  "Где вы находитесь?",
  "Когда заезд и выезд?",
]

type Message = { role: "user" | "bot"; text: string }

function getBotAnswer(input: string): string {
  const lower = input.toLowerCase()
  for (const faq of faqs) {
    if (faq.keywords.some(k => lower.includes(k))) {
      return faq.answer
    }
  }
  return "🤔 Не совсем понял вопрос. Попробуйте спросить иначе или напишите нам напрямую:\n📞 +7 926 234 30 17\n✈️ Telegram | 💬 WhatsApp"
}

export default function ChatBot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "👋 Привет! Я помощник КвартираСуток.\n\nМогу ответить на вопросы о студиях, ценах и бронировании. Чем могу помочь?" }
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, open])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const userMsg: Message = { role: "user", text }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      const answer = getBotAnswer(text)
      setMessages(prev => [...prev, { role: "bot", text: answer }])
      setTyping(false)
    }, 600)
  }

  return (
    <>
      {/* Плавающая кнопка */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-6 z-50 bg-blue-600 text-white w-14 h-14 rounded-full shadow-xl hover:bg-blue-700 transition flex items-center justify-center text-2xl"
      >
        {open ? "✕" : "💬"}
      </button>

      {/* Окно чата */}
      {open && (
        <div className="fixed bottom-36 right-6 z-50 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden" style={{height: "480px"}}>
          
          {/* Шапка */}
          <div className="bg-blue-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="text-white font-semibold text-sm">Помощник</p>
              <p className="text-blue-200 text-xs">КвартираСуток</p>
            </div>
          </div>

          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-line ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"0ms"}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"150ms"}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay:"300ms"}}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Быстрые вопросы */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs px-3 py-1.5 rounded-full hover:bg-blue-100 transition">
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Поле ввода */}
          <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Напишите вопрос..."
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
            />
            <button onClick={() => sendMessage(input)} className="bg-blue-600 text-white w-9 h-9 rounded-xl hover:bg-blue-700 transition flex items-center justify-center">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}