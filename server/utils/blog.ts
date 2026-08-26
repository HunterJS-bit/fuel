import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface BlogPostMeta {
  slug: string
  title: string
  description: string
  date: string
  author: string
  category: string
  tags: string[]
  imageGradient: string
  readTime: number
  locale: string
}

export interface BlogPost extends BlogPostMeta {
  body: string
  html: string
}

const CONTENT_DIR = join(process.cwd(), 'content/blog')

function estimateReadTime(text: string): number {
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function parsePost(slug: string, locale: string, raw: string): BlogPost {
  const { data, content } = matter(raw)
  const body = content.trim()

  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    description: String(data.description ?? ''),
    date: String(data.date ?? new Date().toISOString().slice(0, 10)),
    author: String(data.author ?? 'FuelCalc Team'),
    category: String(data.category ?? 'market'),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    imageGradient: String(data.imageGradient ?? 'linear-gradient(135deg, #3861fb 0%, #1a3a99 100%)'),
    readTime: estimateReadTime(body),
    body,
    html: marked.parse(body) as string
  }
}

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const dir = join(CONTENT_DIR, locale)

  try {
    const files = await readdir(dir)
    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith('.md'))
        .map(async (file) => {
          const slug = file.replace(/\.md$/, '')
          const raw = await readFile(join(dir, file), 'utf-8')
          return parsePost(slug, locale, raw)
        })
    )

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch {
    return []
  }
}

export async function getBlogPost(slug: string, locale: string): Promise<BlogPost | null> {
  try {
    const raw = await readFile(join(CONTENT_DIR, locale, `${slug}.md`), 'utf-8')
    return parsePost(slug, locale, raw)
  } catch {
    return null
  }
}

export async function getAllTags(locale: string): Promise<string[]> {
  const posts = await getBlogPosts(locale)
  const tags = new Set<string>()
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)))
  return [...tags].sort()
}
