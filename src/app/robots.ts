import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Drafts stay out of search engines until the house opens on purpose.
  if (process.env.APOTHECARY_INDEX === "yes") return { rules: { userAgent: "*", allow: "/" } };
  return { rules: { userAgent: "*", disallow: "/" } };
}
