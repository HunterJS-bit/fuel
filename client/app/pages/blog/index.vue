<template>
  <div class="blog-page">
    <section class="blog-hero">
      <div class="hero-inner">
        <span class="hero-badge">{{ $t('blog.badge') }}</span>
        <h1>{{ $t('blog.title') }}</h1>
        <p class="hero-sub subtitle-animate">{{ $t('blog.subtitle') }}</p>
      </div>
    </section>

    <section class="blog-content">
      <div class="content-inner">
        <div class="filter-bar">
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="filter-btn"
            :class="{ active: activeCategory === cat.key }"
            @click="activeCategory = cat.key"
          >
            {{ $t(cat.labelKey) }}
          </button>
        </div>

        <div class="blog-grid">
          <BlogCard
            v-for="post in filteredPosts"
            :key="post.slug"
            :post="post"
          />
        </div>

        <p v-if="filteredPosts.length === 0" class="empty-state">
          {{ $t('blog.noPosts') }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { ref, computed } from 'vue'
import { blogPosts } from '~/data/blogPosts'

const activeCategory = ref('all')

const categories = [
  { key: 'all', labelKey: 'blog.categories.all' },
  { key: 'blog.categories.market', labelKey: 'blog.categories.market' },
  { key: 'blog.categories.companies', labelKey: 'blog.categories.companies' },
  { key: 'blog.categories.tips', labelKey: 'blog.categories.tips' },
  { key: 'blog.categories.lpg', labelKey: 'blog.categories.lpg' },
  { key: 'blog.categories.policy', labelKey: 'blog.categories.policy' }
]

const filteredPosts = computed(() => {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  if (activeCategory.value === 'all') return sorted
  return sorted.filter((post) => post.categoryKey === activeCategory.value)
})
</script>

<style scoped>
.blog-page {
  overflow-x: hidden;
}

.blog-hero {
  padding: 80px 24px 60px;
  background: var(--landing-hero-bg);
  text-align: center;
}
.hero-inner {
  max-width: 800px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  background: var(--primary-subtle);
  color: var(--primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid var(--primary-border);
}
.blog-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
}
.hero-sub {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.6;
}

.blog-content {
  padding: 60px 24px 80px;
  background: var(--bg-color);
}
.content-inner {
  max-width: 1200px;
  margin: 0 auto;
}

.filter-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}
.filter-btn {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 8px 18px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Outfit', sans-serif;
}
.filter-btn:hover {
  border-color: var(--primary);
  color: var(--text-main);
}
.filter-btn.active {
  background: var(--fuel-gradient);
  color: var(--on-primary, #fff);
  border-color: transparent;
  box-shadow: 0 2px 12px var(--primary-glow);
}

.blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.empty-state {
  text-align: center;
  color: var(--text-muted);
  padding: 40px;
}

@media (max-width: 600px) {
  .blog-grid {
    grid-template-columns: 1fr;
  }
}
</style>
