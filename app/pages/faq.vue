<template>
  <div class="faq-page">
    <!-- Hero Section -->
    <section class="faq-hero">
      <div class="hero-inner">
        <span class="hero-badge">{{ $t('faq.badge') }}</span>
        <h1>{{ $t('faq.title') }}</h1>
        <p class="hero-sub">{{ $t('faq.subtitle') }}</p>
      </div>
    </section>

    <!-- FAQ Content -->
    <section class="faq-content">
      <div class="content-inner">
        <div class="faq-categories">
          <button 
            v-for="category in categories" 
            :key="category.id"
            class="category-btn"
            :class="{ active: activeCategory === category.id }"
            @click="activeCategory = category.id"
          >
            {{ $t(category.nameKey) }}
          </button>
        </div>

        <div class="faq-list">
          <div 
            v-for="faq in filteredFaqs" 
            :key="faq.id"
            class="faq-item"
            :class="{ open: openFaq === faq.id }"
          >
            <button class="faq-question" @click="toggleFaq(faq.id)">
              <span>{{ $t(faq.questionKey) }}</span>
              <svg class="faq-icon" viewBox="0 0 24 24" width="20" height="20">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" fill="currentColor"/>
              </svg>
            </button>
            <div class="faq-answer" v-show="openFaq === faq.id">
              <p>{{ $t(faq.answerKey) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="cta-inner">
        <h2>{{ $t('faq.ctaTitle') }}</h2>
        <p>{{ $t('faq.ctaSubtitle') }}</p>
        <div class="cta-buttons">
          <NuxtLink to="/contact" class="btn-primary">{{ $t('faq.contactUs') }}</NuxtLink>
          <NuxtLink to="/map" class="btn-outline">{{ $t('faq.findStation') }}</NuxtLink>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { ref, computed } from 'vue'

const activeCategory = ref('general')
const openFaq = ref(null)

const categories = [
  { id: 'general', nameKey: 'faq.categories.general' },
  { id: 'prices', nameKey: 'faq.categories.prices' },
  { id: 'app', nameKey: 'faq.categories.app' },
  { id: 'account', nameKey: 'faq.categories.account' }
]

const faqs = [
  // General
  { id: 1, category: 'general', questionKey: 'faq.q1.question', answerKey: 'faq.q1.answer' },
  { id: 2, category: 'general', questionKey: 'faq.q2.question', answerKey: 'faq.q2.answer' },
  { id: 3, category: 'general', questionKey: 'faq.q3.question', answerKey: 'faq.q3.answer' },
  // Prices
  { id: 4, category: 'prices', questionKey: 'faq.q4.question', answerKey: 'faq.q4.answer' },
  { id: 5, category: 'prices', questionKey: 'faq.q5.question', answerKey: 'faq.q5.answer' },
  { id: 6, category: 'prices', questionKey: 'faq.q6.question', answerKey: 'faq.q6.answer' },
  // App
  { id: 7, category: 'app', questionKey: 'faq.q7.question', answerKey: 'faq.q7.answer' },
  { id: 8, category: 'app', questionKey: 'faq.q8.question', answerKey: 'faq.q8.answer' },
  // Account
  { id: 9, category: 'account', questionKey: 'faq.q9.question', answerKey: 'faq.q9.answer' },
  { id: 10, category: 'account', questionKey: 'faq.q10.question', answerKey: 'faq.q10.answer' }
]

const filteredFaqs = computed(() => {
  return faqs.filter(faq => faq.category === activeCategory.value)
})

const toggleFaq = (id) => {
  openFaq.value = openFaq.value === id ? null : id
}

</script>

<style scoped>
.faq-page {
  overflow-x: hidden;
}

.faq-hero {
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
.faq-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
}
.hero-sub {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.6;
}

/* ── FAQ Content ── */
.faq-content {
  padding: 60px 24px;
  background: var(--bg-color);
}
.content-inner {
  max-width: 900px;
  margin: 0 auto;
}
.faq-categories {
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
}
.category-btn {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.category-btn:hover {
  border-color: var(--primary);
  color: var(--text-main);
}
.category-btn.active {
  background: var(--primary);
  color: var(--on-primary);
  border-color: var(--primary);
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.faq-item {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s;
}
.faq-item:hover {
  border-color: var(--primary-border);
}
.faq-question {
  width: 100%;
  background: transparent;
  border: none;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  cursor: pointer;
  color: var(--text-main);
  font-size: 1.05rem;
  font-weight: 600;
  text-align: left;
  font-family: 'Outfit', sans-serif;
}
.faq-icon {
  flex-shrink: 0;
  transition: transform 0.3s ease;
  color: var(--primary);
}
.faq-item.open .faq-icon {
  transform: rotate(180deg);
}
.faq-answer {
  padding: 0 24px 20px;
  border-top: 1px solid var(--border-color);
  animation: slideDown 0.3s ease;
}
.faq-answer p {
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
  padding-top: 16px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── CTA Section ── */
.cta-section {
  padding: 80px 24px;
  background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 60%);
  text-align: center;
}
.cta-inner h2 {
  font-size: 2rem;
  margin-bottom: 12px;
}
.cta-inner p {
  color: var(--text-muted);
  margin-bottom: 32px;
}
.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-primary {
  background: var(--primary);
  color: var(--on-primary);
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px var(--primary-glow);
}
.btn-outline {
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: var(--primary-subtle);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .faq-categories { flex-direction: column; }
  .category-btn { width: 100%; }
}
</style>
