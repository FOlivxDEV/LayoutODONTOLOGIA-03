import type { MetadataRoute } from "next";
import { siteConfig } from "./site-config";
export default function sitemap(): MetadataRoute.Sitemap { return ["", "/privacidade", "/cookies", "/termos"].map(path => ({ url: `${siteConfig.seo.canonicalUrl}${path}`, changeFrequency: path ? "yearly" : "monthly", priority: path ? 0.4 : 1 })); }
