<template>
  <div v-if="post" class="article-page">
    <section class="article-hero" :style="{ backgroundImage: `url(https://placehold.co/1200x600/1e293b/fff?text=${post.slug})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
      <div class="hero-overlay">
        <NuxtLink to="/blog" class="back-link">← {{ $t('blog.backToBlog') }}</NuxtLink>
        <span class="article-category">{{ $t(post.categoryKey) }}</span>
        <h1>{{ $t(post.titleKey) }}</h1>
        <div class="article-meta">
          <span>{{ post.author }}</span>
          <span class="meta-dot">·</span>
          <time :datetime="post.date">{{ formattedDate }}</time>
          <span class="meta-dot">·</span>
          <span>{{ post.readTime }} {{ $t('blog.minRead') }}</span>
        </div>
      </div>
    </section>

    <section class="article-body">
      <div class="body-inner">
        <p class="article-content">{{ $t(post.contentKey) }}</p>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { computed } from 'vue'
import { getPostBySlug } from '~/data/blogPosts'

const route = useRoute()
const { locale, t } = useI18n()

const post = getPostBySlug(String(route.params.slug))

if (!post) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' })
}

const formattedDate = computed(() =>
  new Date(post.date).toLocaleDateString(locale.value === 'sr' ? 'sr-RS' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
)

useHead({
  title: `${t(post.titleKey)} | 1-2-3 Fuel`
})
</script>

<style scoped>
.article-page {
  overflow-x: hidden;
}

.article-hero {
  padding: 100px 24px 60px;
  min-height: 320px;
  display: flex;
  align-items: flex-end;
  position: relative;
}
.hero-overlay {
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}
.back-link {
  display: inline-block;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 24px;
  transition: color 0.2s;
}
.back-link:hover { color: #fff; }
.article-category {
  display: inline-block;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 16px;
}
.article-hero h1 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 16px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
.article-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
}
.meta-dot { opacity: 0.6; }

.article-body {
  padding: 60px 24px 80px;
  background: var(--bg-color);
}
.body-inner {
  max-width: 720px;
  margin: 0 auto;
}
.article-content {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.8;
}
</style>
