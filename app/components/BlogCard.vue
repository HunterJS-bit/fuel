<template>
  <NuxtLink :to="`/blog/${post.slug}`" class="blog-card">
    <div class="card-image" :style="{ backgroundImage: `url(https://placehold.co/600x400/1e293b/fff?text=${post.slug})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
      <span class="card-category">{{ $t(post.categoryKey) }}</span>
    </div>
    <div class="card-body">
      <div class="card-meta">
        <time :datetime="post.date">{{ formattedDate }}</time>
        <span class="meta-dot">·</span>
        <span>{{ post.readTime }} {{ $t('blog.minRead') }}</span>
      </div>
      <h3 class="card-title">{{ $t(post.titleKey) }}</h3>
      <p class="card-excerpt">{{ $t(post.excerptKey) }}</p>
      <div class="card-footer">
        <span class="card-author">{{ post.author }}</span>
        <span class="read-more">{{ $t('blog.readMore') }} →</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const { locale } = useI18n()

const formattedDate = computed(() => {
  return new Date(props.post.date).toLocaleDateString(locale.value === 'sr' ? 'sr-RS' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
})
</script>

<style scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  height: 100%;
}
.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border-color: var(--primary-border);
}
.card-image {
  height: 160px;
  position: relative;
  display: flex;
  align-items: flex-end;
  padding: 16px;
}
.card-category {
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.card-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}
.meta-dot { opacity: 0.5; }
.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.35;
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-excerpt {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.55;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 16px;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 14px;
  margin-top: auto;
}
.card-author {
  font-size: 0.85rem;
  color: var(--text-muted);
}
.read-more {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary);
}
</style>
