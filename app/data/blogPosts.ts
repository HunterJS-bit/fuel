export interface BlogPost {
  slug: string
  date: string
  categoryKey: string
  imageGradient: string
  titleKey: string
  excerptKey: string
  contentKey: string
  author: string
  readTime: number
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'diesel-prices-rise-august-2026',
    date: '2026-08-18',
    categoryKey: 'blog.categories.market',
    imageGradient: 'linear-gradient(135deg, #0066cc 0%, #004499 100%)',
    titleKey: 'blog.posts.p1.title',
    excerptKey: 'blog.posts.p1.excerpt',
    contentKey: 'blog.posts.p1.content',
    author: 'FuelCalc Team',
    readTime: 4
  },
  {
    slug: 'nis-petrol-price-adjustment',
    date: '2026-08-15',
    categoryKey: 'blog.categories.companies',
    imageGradient: 'linear-gradient(135deg, #00843d 0%, #005c2a 100%)',
    titleKey: 'blog.posts.p2.title',
    excerptKey: 'blog.posts.p2.excerpt',
    contentKey: 'blog.posts.p2.content',
    author: 'Marko J.',
    readTime: 3
  },
  {
    slug: 'lpg-prices-stable-summer',
    date: '2026-08-12',
    categoryKey: 'blog.categories.lpg',
    imageGradient: 'linear-gradient(135deg, #ff6600 0%, #cc5200 100%)',
    titleKey: 'blog.posts.p3.title',
    excerptKey: 'blog.posts.p3.excerpt',
    contentKey: 'blog.posts.p3.content',
    author: 'Ana P.',
    readTime: 5
  },
  {
    slug: 'best-time-to-fill-up-belgrade',
    date: '2026-08-08',
    categoryKey: 'blog.categories.tips',
    imageGradient: 'linear-gradient(135deg, #3861fb 0%, #1a3a99 100%)',
    titleKey: 'blog.posts.p4.title',
    excerptKey: 'blog.posts.p4.excerpt',
    contentKey: 'blog.posts.p4.content',
    author: 'FuelCalc Team',
    readTime: 6
  },
  {
    slug: 'omv-vs-mol-price-comparison',
    date: '2026-08-05',
    categoryKey: 'blog.categories.companies',
    imageGradient: 'linear-gradient(135deg, #003da5 0%, #002266 100%)',
    titleKey: 'blog.posts.p5.title',
    excerptKey: 'blog.posts.p5.excerpt',
    contentKey: 'blog.posts.p5.content',
    author: 'Stefan K.',
    readTime: 4
  },
  {
    slug: 'euro-diesel-tax-changes-2026',
    date: '2026-08-01',
    categoryKey: 'blog.categories.policy',
    imageGradient: 'linear-gradient(135deg, #e30613 0%, #990004 100%)',
    titleKey: 'blog.posts.p6.title',
    excerptKey: 'blog.posts.p6.excerpt',
    contentKey: 'blog.posts.p6.content',
    author: 'FuelCalc Team',
    readTime: 7
  },
  {
    slug: 'eco-stations-lowest-prices',
    date: '2026-07-28',
    categoryKey: 'blog.categories.companies',
    imageGradient: 'linear-gradient(135deg, #2ecc71 0%, #1a9952 100%)',
    titleKey: 'blog.posts.p7.title',
    excerptKey: 'blog.posts.p7.excerpt',
    contentKey: 'blog.posts.p7.content',
    author: 'Jelena M.',
    readTime: 3
  },
  {
    slug: 'fuel-efficiency-driving-tips',
    date: '2026-07-22',
    categoryKey: 'blog.categories.tips',
    imageGradient: 'linear-gradient(135deg, #9b59b6 0%, #6c3483 100%)',
    titleKey: 'blog.posts.p8.title',
    excerptKey: 'blog.posts.p8.excerpt',
    contentKey: 'blog.posts.p8.content',
    author: 'FuelCalc Team',
    readTime: 5
  }
]

export function getLatestPosts(count = 3): BlogPost[] {
  return [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count)
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
