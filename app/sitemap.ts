import type { MetadataRoute } from "next"

const BASE_URL = "https://opensyntax-academy.vercel.app"

const staticRoutes: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"] }> = [
  { path: "",              priority: 1.0,  changeFrequency: "weekly"  },
  { path: "/courses",      priority: 0.95, changeFrequency: "weekly"  },

  { path: "/changelog",    priority: 0.6,  changeFrequency: "monthly" },
  { path: "/contributing", priority: 0.6,  changeFrequency: "monthly" },
  { path: "/status",       priority: 0.5,  changeFrequency: "daily"   },
  { path: "/terms",        priority: 0.3,  changeFrequency: "yearly"  },
  { path: "/privacy",      priority: 0.3,  changeFrequency: "yearly"  },
]

const courseRoutes: Array<{ slug: string; title: string }> = [
  { slug: "web",            title: "Full-Stack Web Engineering"    },
  { slug: "discord",        title: "Advanced Discord Development"  },
  { slug: "python",         title: "Python & Data Science"         },
  { slug: "ai-ml",          title: "AI/ML Engineering"             },
  { slug: "typescript",     title: "TypeScript Mastery"            },
  { slug: "devops",         title: "DevOps & Cloud Infrastructure" },
  { slug: "databases",      title: "Database Engineering"          },
  { slug: "react-patterns", title: "Advanced React Patterns"       },
  { slug: "cybersecurity",  title: "Cybersecurity"                 },
  { slug: "blockchain",     title: "Blockchain & Web3"             },
  { slug: "mobile",         title: "Mobile Engineering"            },
  { slug: "system-design",  title: "System Design"                 },
  { slug: "rust",           title: "Rust & Systems Programming"    },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: BASE_URL + path,
    lastModified,
    changeFrequency,
    priority,
  }))

  const courseEntries: MetadataRoute.Sitemap = courseRoutes.map(({ slug }) => ({
    url: BASE_URL + "/courses/" + slug,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.85,
  }))

  return [...staticEntries, ...courseEntries]
}
