"use client"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import SideMenu from "@/components/SideMenu"
import { useLang } from "@/components/LangProvider"

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={`text-2xl transition ${(hover || value) >= star ? "text-yellow-400" : "text-gray-300"} ${!onChange ? "cursor-default" : "cursor-pointer"}`}
        >★</button>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { t, lang } = useLang()
  const studioId = Number(searchParams.get("studio") || 1)

  const studioNames: Record<number, string> = {
    1: lang === "ru" ? "Студия 1 — Уютная" : "Studio 1 — Cozy",
    2: lang === "ru" ? "Студия 2 — Современная" : "Studio 2 — Modern",
    3: lang === "ru" ? "Студия 3 — Премиум" : "Studio 3 — Premium",
  }

  const [user, setUser] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ rating: 5, text: "" })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeStudio, setActiveStudio] = useState(studioId)

  useEffect(() => {
    const saved = localStorage.getItem("user")
    if (saved) setUser(JSON.parse(saved))
    fetchReviews(activeStudio)
  }, [activeStudio])

  const fetchReviews = async (id: number) => {
    setLoading(true)
    const res = await fetch(`/api/reviews?studio_id=${id}`)
    const data = await res.json()
    setReviews(data.reviews || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) { router.push("/auth/login"); return }
    if (!form.text.trim()) { setError(lang === "ru" ? "Напишите текст отзыва" : "Please write a review"); return }
    setSubmitting(true); setError(""); setSuccess("")
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, studio_id: activeStudio, rating: form.rating, text: form.text }),
    })
    const data = await res.json()
    setSubmitting(false)
    if (!res.ok) { setError(data.error); return }
    setSuccess(lang === "ru" ? "Отзыв опубликован! Спасибо!" : "Review published! Thank you!")
    setForm({ rating: 5, text: "" })
    fetchReviews(activeStudio)
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  const formatDate = (str: string) =>
    new Date(str).toLocaleDateString(lang === "ru" ? "ru" : "en", { day: "numeric", month: "long", year: "numeric" })

  const reviewWord = (n: number) => {
    if (lang === "en") return n === 1 ? "review" : "reviews"
    return n === 1 ? "отзыв" : n < 5 ? "отзыва" : "отзывов"
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <SideMenu />
          <a href="/" className="text-xl font-bold text-blue-600">КвартираСуток</a>
        </div>
        <a href={"/studios/" + activeStudio} className="text-gray-600 hover:text-blue-600 text-sm">← {t("studios.back")}</a>
      </header>

      <div className="max-w-3xl mx-auto py-10 px-6">

        {/* Фильтр по студиям */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: 0, label: t("reviews.all_studios") },
            { id: 1, label: studioNames[1] },
            { id: 2, label: studioNames[2] },
            { id: 3, label: studioNames[3] },
          ].map(s => (
            <button
              key={s.id}
              onClick={() => { setActiveStudio(s.id || studioId); fetchReviews(s.id || studioId) }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeStudio === (s.id || studioId) ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Заголовок */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">{t("reviews.title")}</h1>
          <p className="text-gray-500 mb-4">{studioNames[activeStudio] || t("reviews.all_studios")}</p>
          {avgRating ? (
            <div className="flex items-center gap-3">
              <span className="text-5xl font-bold text-gray-800">{avgRating}</span>
              <div>
                <StarRating value={Math.round(Number(avgRating))} />
                <p className="text-gray-400 text-sm mt-1">{reviews.length} {reviewWord(reviews.length)}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">{lang === "ru" ? "Отзывов пока нет — будьте первым!" : "No reviews yet — be the first!"}</p>
          )}
        </div>

        {/* Форма */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{t("reviews.add_review")}</h2>
          {!user ? (
            <div>
              <p className="text-gray-500 text-sm mb-3">{lang === "ru" ? "Для написания отзыва необходимо войти в аккаунт" : "You need to sign in to leave a review"}</p>
              <a href="/auth/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 inline-block">{t("auth.login_btn")}</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm text-gray-500 mb-2 block">{t("reviews.rating")}</label>
                <StarRating value={form.rating} onChange={v => setForm({...form, rating: v})} />
              </div>
              <div>
                <label className="text-sm text-gray-500 mb-1 block">{t("reviews.your_review")}</label>
                <textarea
                  value={form.text}
                  onChange={e => setForm({...form, text: e.target.value})}
                  placeholder={t("reviews.text_placeholder")}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:border-blue-400"
                />
              </div>
              {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
              {success && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}
              <button type="submit" disabled={submitting} className="bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50">
                {submitting ? (lang === "ru" ? "Публикация..." : "Publishing...") : t("reviews.submit_btn")}
              </button>
            </form>
          )}
        </div>

        {/* Список отзывов */}
        {loading ? (
          <div className="text-center text-gray-400 py-8">{lang === "ru" ? "Загрузка..." : "Loading..."}</div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400">{t("reviews.empty")}</div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-gray-800">{r.users?.name || (lang === "ru" ? "Гость" : "Guest")}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{formatDate(r.created_at)}</p>
                  </div>
                  <StarRating value={r.rating} />
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}