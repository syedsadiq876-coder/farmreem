import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.farmreem.com";
  const lastModDate = new Date("2026-09-23");

  return [
    { url: `${baseUrl}/`, lastModified: lastModDate, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/products`, lastModified: lastModDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/products/live-broiler`, lastModified: lastModDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/resources`, lastModified: lastModDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/solutions/hotels-restaurants`, lastModified: lastModDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/solutions/caterers-institutions`, lastModified: lastModDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/supply-network`, lastModified: lastModDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/building-farmreem-farms`, lastModified: lastModDate, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/become-partner`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/request-pricing`, lastModified: lastModDate, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/privacy`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, lastModified: lastModDate, changeFrequency: "monthly", priority: 0.3 },
  ];
}
