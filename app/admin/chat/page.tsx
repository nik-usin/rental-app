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
  users?: { name: string; email: string }
}

export default function AdminChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState("")
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (!saved) { router.push("/auth/login"); return }
    const u = JSON.parse(saved)
    if (u.role !== "admin") { router.push("/"); return }
    fetchAllMessages()

    const channel = supabase
      .channel("admin-messages")
      .on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => {
        fetchAllMessages()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedUser, messages])

  const fetchAllMessages = async () => {
    const res = await fetch("/api/messages?all=true")
    const data = await res.json()
    const allMessages: Message[] = data.messages || []
    setMessages(allMessages)

    const userMap = new Map()
    allMessages.forEach(m => {
      if (m.users && !userMap.has(m.user_id)) {
        userMap.set(m.user_id, { id: m.user_id, name: m.users.name, email: m.users.email })
      }
    })
    setUsers(Array.from(userMap.values()))
    setLoading(false)
  }

  const userMessages = messages.filter(m => m.user_id === selectedUser?.id)

  const getLastMessage = (userId: number) => {
    const msgs = messages.filter(m => m.user_id === userId)
    return msgs[msgs.length - 1]
  }

  const getUnreadCount = (userId: number) => {
    return messages.filter(m => m.user_id === userId && m.sender === "user" && !m.is_read).length
  }

  const sendMessage = async () => {
    if (!input.trim() || !selectedUser) return
    await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: selectedUser.id, text: input, sender: "admin" })
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
        <a href="/admin/dashboard" className="text-gray-600 hover:text-blue-600 text-sm">← Админ панель</a>
      </header>

      <div className="max-w-5xl mx-auto w-full px-4 py-6" style={{height: "calc(100vh - 73px)"}}>
        <div className="bg-white rounded-2xl shadow-sm flex overflow-hidden" style={{height: "100%"}}>

          <div className="w-80 border-r border-gray-100 flex flex-col">
            <div className="px-4 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">💬 Чаты</h2>
              <p className="text-gray-400 text-xs mt-1">{users.length} пользователей</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {users.length === 0 && (
                <div className="text-center text-gray-400 py-8 px-4">
                  <p className="text-3xl mb-2">💬</p>
                  <p className="text-sm">Сообщений пока нет</p>
                </div>
              )}
              {users.map(u => {
                const last = getLastMessage(u.id)
                const unread = getUnreadCount(u.id)
                return (
                  <button
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition border-b border-gray-50 ${selectedUser?.id === u.id ? "bg-blue-50" : ""}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-semibold text-gray-800 text-sm truncate">{u.name}</p>
                        {unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">{unread}</span>
                        )}
                      </div>
                      {last && <p className="text-gray-400 text-xs truncate mt-0.5">{last.sender === "admin" ? "Вы: " : ""}{last.text}</p>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {!selectedUser ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <p className="text-5xl mb-4">💬</p>
                  <p className="font-medium">Выберите чат</p>
                  <p className="text-sm mt-1">Нажмите на пользователя слева</p>
                </div>
              </div>
            ) : (
              <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {selectedUser.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{selectedUser.name}</p>
                    <p className="text-gray-400 text-xs">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
                  {userMessages.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                      <p className="text-sm">Нет сообщений</p>
                    </div>
                  )}
                  {userMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] group relative flex flex-col ${msg.sender === "admin" ? "items-end" : "items-start"}`}>
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
                          <div className={`px-4 py-2 rounded-2xl text-sm ${msg.sender === "admin" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                            {msg.text}
                            {msg.edited && <span className="text-xs opacity-60 ml-2">изм.</span>}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{formatTime(msg.created_at)}</span>
                          {editingId !== msg.id && (
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
                    placeholder={`Ответить ${selectedUser.name}...`}
                    className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none"
                  />
                  <button onClick={sendMessage} className="bg-blue-600 text-white w-10 h-10 rounded-xl hover:bg-blue-700 transition flex items-center justify-center">
                    ➤
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}