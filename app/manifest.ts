import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest { return { name: "Jr Odontologia", short_name: "Jr Odontologia", description: "Cuidado odontológico humanizado.", start_url: "/", display: "standalone", background_color: "#f5f8f7", theme_color: "#071b2b", icons: [{ src: "/logo-jr-transparent.png", sizes: "150x150", type: "image/png" }] }; }
