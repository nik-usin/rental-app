"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import SideMenu from "@/components/SideMenu"
import { supabase } from "@/lib/supabase"

type Message = {
  id: number
  user_id: number
  text: string
  sender: "user" | "admin"
  is_read: boolean
  edited: boolean
  created_at: string
}

export default function ChatSupportPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (!saved) { router.push("/auth/login"); return }
    const u = JSON.parse(saved)
    setUser(u)
    fetchMessages(u.id)

    const channel = supabase
      .channel("messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchMessages(u.id)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchMessages = async (userId: number) => {
    const res = await fetch(`/api/messages?user_id=${userId}`)
    const data = await res.json()
    setMessages(data.messages || [])
    setLoading(false)
  }

  const sendMessage = async () => {
    if (!input.trim()) return
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, text: input, sender: "user" })
    })
    setInput("")
  }

  const editMessage = async (id: number) => {
    if (!editText.trim()) return
    await fetch("/api/messages", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, text: editText })
    })
    setEditingId(null)
    setEditText("")
  }

  const deleteMessage = async (id: number) => {
    if (!confirm("Удалить сообщение?")) return
    await fetch("/api/messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    })
  }

  const formatTime = (str: string) => new Date(str).toLocaleTimeString("ru", { hour: "2-digit", minute: "2-digit" })

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">Загрузка...</div>

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href="/" className="text-gray-600 hover:text-blue-600 text-sm">← Назад</a>
      </header>

      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 py-6 px-4" style={{height: "calc(100vh - 73px)"}}>
        <div className="bg-white rounded-2xl shadow-sm flex flex-col flex-1 overflow-hidden">
          <div className="bg-blue-600 px-6 py-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🏠</div>
            <div>
              <p className="text-white font-bold">Поддержка</p>
              <p className="text-blue-200 text-xs">Студии «На холмах»</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                <p className="text-4xl mb-3">💬</p>
                <p className="font-medium">Напишите нам!</p>
                <p className="text-sm mt-1">Мы ответим в ближайшее время</p>
              </div>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] group relative ${msg.sender === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  {editingId === msg.id ? (
                    <div className="flex gap-2 items-center">
                      <input
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && editMessage(msg.id)}
                        className="border border-blue-400 rounded-xl px-3 py-2 text-sm focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => editMessage(msg.id)} className="text-blue-600 text-sm font-semibold">✓</button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 text-sm">✕</button>
                    </div>
                  ) : (
                    <div className={`px-4 py-2 rounded-2xl text-sm ${msg.sender === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                      {msg.text}
                      {msg.edited && <span className="text-xs opacity-60 ml-2">изм.</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{formatTime(msg.created_at)}</span>
                    {msg.sender === "user" && editingId !== msg.id && (
                      <div className="hidden group-hover:flex gap-1">
                        <button onClick={() => { setEditingId(msg.id); setEditText(msg.text) }} className="text-xs text-gray-400 hover:text-blue-500">✏️</button>
                        <button onClick={() => deleteMessage(msg.id)} className="text-xs text-gray-400 hover:text-red-500">🗑</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Напишите сообщение..."
              className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
            />
            <button onClick={sendMessage} className="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 transition flex items-center justify-center">
              ➤
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}