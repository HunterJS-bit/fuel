import { getAllTags, getBlogPosts } from '../../utils/blog'

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = String(query.locale ?? 'en')

  const [posts, tags] = await Promise.all([
    getBlogPosts(locale),
    getAllTags(locale)
  ])

  return {
    posts: posts.map(({ body, html, ...meta }) => meta),
    tags
  }
})
