"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

export default function ProfilePage() {
  const router = useRouter()
  const { t, lang } = useLang()
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [form, setForm] = useState({ name: "", phone: "", email: "" })
  const [passwordForm, setPasswordForm] = useState({ current: "", new: "", confirm: "" })
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (!saved) { router.push("/auth/login"); return }
    const u = JSON.parse(saved)
    setUser(u)
    setForm({ name: u.name, phone: u.phone, email: u.email })
    fetchBookings(u.id)
    setLoading(false)
  }, [])

  const fetchBookings = async (userId: number) => {
    const { data } = await supabase.from("bookings").select("*").eq("user_id", userId).order("created_at", { ascending: false })
    setBookings(data || [])
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    const ext = file.name.split(".").pop()
    const fileName = `avatar_${user.id}_${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, file, { upsert: true })
    if (uploadError) { setError(lang === "ru" ? "Ошибка загрузки фото" : "Upload error"); setUploadingAvatar(false); return }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(fileName)
    const avatarUrl = urlData.publicUrl
    await supabase.from("users").update({ avatar_url: avatarUrl }).eq("id", user.id)
    const updated = { ...user, avatar_url: avatarUrl }
    localStorage.setItem("user", JSON.stringify(updated))
    setUser(updated)
    setUploadingAvatar(false)
    setMessage(lang === "ru" ? "Фото обновлено!" : "Photo updated!")
  }

  const handleSaveProfile = async () => {
    setMessage(""); setError("")
    const { data, error } = await supabase.from("users").update({ name: form.name, phone: form.phone }).eq("id", user.id).select().single()
    if (error) { setError(lang === "ru" ? "Ошибка сохранения" : "Save error"); return }
    const updated = { ...user, name: data.name, phone: data.phone }
    localStorage.setItem("user", JSON.stringify(updated))
    setUser(updated)
    setEditMode(false)
    setMessage(t("profile.saved"))
  }

  const handleChangePassword = async () => {
    setMessage(""); setError("")
    if (passwordForm.new !== passwordForm.confirm) { setError(lang === "ru" ? "Пароли не совпадают" : "Passwords do not match"); return }
    if (passwordForm.new.length < 6) { setError(lang === "ru" ? "Минимум 6 символов" : "Minimum 6 characters"); return }
    const { error } = await supabase.from("users").update({ password: passwordForm.new }).eq("id", user.id).eq("password", passwordForm.current)
    if (error) { setError(lang === "ru" ? "Неверный текущий пароль" : "Wrong current password"); return }
    setPasswordForm({ current: "", new: "", confirm: "" })
    setMessage(lang === "ru" ? "Пароль изменён!" : "Password changed!")
  }

  const handleLogout = () => { localStorage.removeItem("user"); localStorage.removeItem("loginTime"); router.push("/") }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">{lang === "ru" ? "Загрузка..." : "Loading..."}</div>

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 sticky top-0 z-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/studios" className="text-gray-600 hover:text-blue-600 text-sm">{t("nav.studios")}</a>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 text-sm">{t("nav.logout")}</button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto py-10 px-6 flex flex-col gap-6">
        {message && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>}
        {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
                {user.avatar_url
                  ? <img src={user.avatar_url} alt={t("profile.avatar")} className="w-full h-full object-cover" />
                  : <span className="text-4xl font-bold text-blue-600">{user.name?.[0]?.toUpperCase()}</span>
                }
              </div>
              <button onClick={() => fileInputRef.current?.click()} disabled={uploadingAvatar} className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition shadow-md text-sm">
                {uploadingAvatar ? "..." : "📷"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="text-gray-400 text-xs mt-1">{user.phone}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">{lang === "ru" ? "Личные данные" : "Personal info"}</h2>
            <button onClick={() => setEditMode(!editMode)} className="text-blue-600 hover:underline text-sm">{editMode ? (lang === "ru" ? "Отмена" : "Cancel") : (lang === "ru" ? "Редактировать" : "Edit")}</button>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t("profile.name")}</label>
              {editMode ? <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400" /> : <p className="text-gray-800 font-medium">{user.name}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t("profile.phone")}</label>
              {editMode ? <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400" /> : <p className="text-gray-800 font-medium">{user.phone}</p>}
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t("profile.email")}</label>
              <p className="text-gray-800 font-medium">{user.email}</p>
            </div>
            {editMode && <button onClick={handleSaveProfile} className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mt-2">{t("profile.save_btn")}</button>}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{lang === "ru" ? "Изменить пароль" : "Change password"}</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{lang === "ru" ? "Текущий пароль" : "Current password"}</label>
              <input type="password" value={passwordForm.current} onChange={e => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{t("auth.new_password")}</label>
              <input type="password" value={passwordForm.new} onChange={e => setPasswordForm({...passwordForm, new: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block">{lang === "ru" ? "Повторите новый пароль" : "Confirm new password"}</label>
              <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-400" />
            </div>
            <button onClick={handleChangePassword} className="bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 mt-2">{t("auth.new_password_btn")}</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{lang === "ru" ? "Быстрые действия" : "Quick actions"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/bookings" className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 hover:bg-blue-100 transition">
              <span className="text-2xl">📅</span>
              <div>
                <p className="font-semibold text-blue-700 text-sm">{t("bookings.title")}</p>
                <p className="text-blue-400 text-xs">{bookings.length} {lang === "ru" ? "броней" : "bookings"}</p>
              </div>
            </a>
            <a href="/studios" className="flex items-center gap-3 bg-green-50 rounded-xl p-4 hover:bg-green-100 transition">
              <span className="text-2xl">🏠</span>
              <div>
                <p className="font-semibold text-green-700 text-sm">{t("studios.book_btn")}</p>
                <p className="text-green-400 text-xs">{lang === "ru" ? "Выбрать студию" : "Choose studio"}</p>
              </div>
            </a>
            <a href="/payment" className="flex items-center gap-3 bg-purple-50 rounded-xl p-4 hover:bg-purple-100 transition">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-semibold text-purple-700 text-sm">{t("payment.title")}</p>
                <p className="text-purple-400 text-xs">{t("payment.subtitle")}</p>
              </div>
            </a>
            <a href="/settings" className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition">
              <span className="text-2xl">⚙️</span>
              <div>
                <p className="font-semibold text-gray-700 text-sm">{t("settings.title")}</p>
                <p className="text-gray-400 text-xs">{lang === "ru" ? "Тема, язык" : "Theme, language"}</p>
              </div>
            </a>
          </div>
        </div>

        <button onClick={handleLogout} className="bg-red-50 text-red-500 hover:bg-red-100 py-3 rounded-xl font-medium transition">
          {t("profile.logout")}
        </button>
      </div>
    </main>
  )
}