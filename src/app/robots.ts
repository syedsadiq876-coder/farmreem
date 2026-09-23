import { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  const isPreview = process.env.VERCEL_ENV === "preview" || process.env.NEXT_PUBLIC_VERCEL_ENV === "preview";

  if (isPreview) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login/",
        "/portal/",
        "/admin/",
        "/register/",
        "/reset-password/",
        "/forgot-password/",
      ],
    },
    sitemap: "https://www.farmreem.com/sitemap.xml",
  };
}
