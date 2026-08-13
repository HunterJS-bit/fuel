<template>
  <div class="faq-page">
    <!-- Navigation -->
    <header class="landing-nav">
      <div class="nav-inner">
        <NuxtLink to="/" class="brand">
          <span class="brand-icon">⛽</span>
          <span class="brand-name">1-2-3 <em>Fuel</em></span>
        </NuxtLink>

        <nav class="nav-links">
          <NuxtLink to="/map">{{ $t('nav.map') }}</NuxtLink>
          <NuxtLink to="/list">{{ $t('nav.list') }}</NuxtLink>
          <NuxtLink to="/prices">{{ $t('nav.trends') }}</NuxtLink>
          <NuxtLink to="/faq">{{ $t('nav.faq') }}</NuxtLink>
          <NuxtLink to="/contact">{{ $t('nav.contact') }}</NuxtLink>
        </nav>

        <div class="nav-actions">
          <LanguageSwitcher />
          <button class="theme-btn" @click="toggleTheme" title="Toggle theme">
            <svg v-if="isDark" viewBox="0 0 24 24" width="18" height="18"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/></svg>
            <svg v-else viewBox="0 0 24 24" width="18" height="18"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </header>

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

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-inner">
        <div class="footer-brand">
          <span class="brand-name">1-2-3 <em>Fuel</em></span>
          <p>{{ $t('footer.brand') }}</p>
        </div>
        <div class="footer-links">
          <h4>{{ $t('footer.product') }}</h4>
          <NuxtLink to="/map">{{ $t('footer.liveMap') }}</NuxtLink>
          <NuxtLink to="/list">{{ $t('footer.stationList') }}</NuxtLink>
          <NuxtLink to="/prices">{{ $t('footer.priceTrends') }}</NuxtLink>
        </div>
        <div class="footer-links">
          <h4>{{ $t('footer.companies') }}</h4>
          <a href="#">NIS Petrol</a>
          <a href="#">OMV</a>
          <a href="#">MOL</a>
          <a href="#">Lukoil</a>
        </div>
        <div class="footer-links">
          <h4>{{ $t('footer.support') }}</h4>
          <NuxtLink to="/faq">{{ $t('footer.faq') }}</NuxtLink>
          <a href="#">{{ $t('footer.reportPrice') }}</a>
          <NuxtLink to="/contact">{{ $t('footer.contact') }}</NuxtLink>
        </div>
      </div>
      <div class="footer-bottom">
        <span>{{ $t('footer.copyright') }}</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { ref, computed, onMounted } from 'vue'

const { isDark, toggleTheme, initTheme } = useTheme()

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

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.faq-page {
  overflow-x: hidden;
}

/* ── Navigation ── */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--landing-nav-bg);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border-color);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--text-main);
}
.brand-icon { font-size: 1.6rem; }
.brand-name {
  font-size: 1.4rem;
  font-weight: 700;
}
.brand-name em {
  color: var(--primary);
  font-style: normal;
}
.nav-links {
  display: flex;
  gap: 32px;
}
.nav-links a {
  color: var(--text-muted);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--primary);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
.theme-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
  width: 38px;
  height: 38px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Hero ── */
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

/* ── Footer ── */
.landing-footer {
  background: var(--panel-bg);
  border-top: 1px solid var(--border-color);
  padding: 60px 24px 0;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
}
.footer-brand p {
  color: var(--text-muted);
  margin-top: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
}
.footer-links h4 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.footer-links a {
  display: block;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 10px;
  opacity: 0.8;
  transition: color 0.2s;
}
.footer-links a:hover { color: var(--primary); opacity: 1; }
.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding: 20px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
 margin-top: 0;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .footer-inner { grid-template-columns: 1fr 1fr; }
  .nav-links { display: none; }
}
@media (max-width: 600px) {
  .footer-inner { grid-template-columns: 1fr; }
  .faq-categories { flex-direction: column; }
  .category-btn { width: 100%; }
}
</style>
