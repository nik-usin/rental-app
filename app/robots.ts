import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/api/", "/profile/", "/settings/"] },
    sitemap: "https://ваш-домен.ru/sitemap.xml",
  }
}