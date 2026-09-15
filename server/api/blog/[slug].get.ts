import { getBlogPost } from '../../utils/blog'

export default defineCachedEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const query = getQuery(event)
  const locale = String(query.locale ?? 'en')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug required' })
  }

  const post = await getBlogPost(slug, locale)

  if (!post) {
    throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  }

  return post
})
