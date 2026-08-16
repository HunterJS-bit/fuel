<template>
  <div class="landing">
    <!-- Hero Section (Tradix-inspired) -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-content">
          <span class="hero-badge">{{ $t('hero.badge') }}</span>
          <h1>
            {{ $t('hero.titlePre') }}<span class="highlight">{{ $t('hero.titleHighlight') }}</span>{{ $t('hero.titlePost') }}
          </h1>
          <p class="hero-sub">
            {{ $t('hero.subtitle') }}
          </p>
          <div class="hero-cta">
            <NuxtLink to="/map" class="btn-primary-lg">{{ $t('hero.getStarted') }}</NuxtLink>
            <NuxtLink to="/list" class="btn-outline-lg">{{ $t('hero.browsePrices') }}</NuxtLink>
          </div>
        </div>

        <div class="hero-widget">
          <div class="widget-card">
            <h3 class="widget-title">{{ $t('widget.title') }}</h3>
            <div class="widget-field">
              <label>{{ $t('widget.fuelType') }}</label>
              <select v-model="fuelType">
                <option value="eurodiesel">{{ $t('fuelTypes.eurodiesel') }}</option>
                <option value="bmb95">{{ $t('fuelTypes.bmb95') }}</option>
                <option value="lpg">{{ $t('fuelTypes.lpg') }}</option>
              </select>
            </div>
            <div class="widget-field">
              <label>{{ $t('widget.liters') }}</label>
              <input v-model.number="liters" type="number" min="10" max="100" />
            </div>
            <div class="widget-result">
              <span class="result-label">{{ $t('widget.saveVsAverage') }}</span>
              <span class="result-value">{{ savings.toFixed(0) }} <small>RSD</small></span>
            </div>
            <NuxtLink to="/list" class="btn-widget">
              {{ $t('widget.findCheapest') }}
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Fuel Companies Section (CrypGo-inspired) -->
    <section class="companies-section">
      <div class="section-inner">
        <span class="section-badge">{{ $t('companies.badge') }}</span>
        <h2>{{ $t('companies.title') }}</h2>
        <p class="section-sub">{{ $t('companies.subtitle') }}</p>

        <div class="companies-grid">
          <div
            v-for="company in fuelCompanies"
            :key="company.id"
            class="company-card"
            :class="{ 'best-price': company.isLowest }"
          >
            <div class="card-header">
              <div class="company-logo" :style="{ background: company.color }">
                {{ company.initials }}
              </div>
              <div class="company-meta">
                <h3>{{ company.name }}</h3>
                <span class="fuel-type-tag">{{ company.fuelType }}</span>
              </div>
              <span v-if="company.isLowest" class="lowest-badge">{{ $t('companies.lowest') }}</span>
            </div>

            <div class="card-price">
              <span class="price-amount">{{ company.price.toFixed(1) }}</span>
              <span class="price-unit">RSD/L</span>
            </div>

            <div class="card-change" :class="company.change >= 0 ? 'up' : 'down'">
              <svg v-if="company.change >= 0" viewBox="0 0 24 24" width="14" height="14"><path d="M7 14l5-5 5 5H7z" fill="currentColor"/></svg>
              <svg v-else viewBox="0 0 24 24" width="14" height="14"><path d="M7 10l5 5 5-5H7z" fill="currentColor"/></svg>
              {{ Math.abs(company.change).toFixed(2) }}% <span class="change-period">24h</span>
            </div>

            <svg class="sparkline" viewBox="0 0 120 32" preserveAspectRatio="none">
              <polyline
                :points="company.sparkline"
                fill="none"
                :stroke="company.change >= 0 ? 'var(--success)' : 'var(--danger)'"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div class="card-footer">
              <span class="stations-count">{{ company.stations }} {{ $t('companies.stations') }}</span>
              <NuxtLink :to="`/list?brand=${company.slug}`" class="card-link">{{ $t('companies.viewAll') }}</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trusted Brands Row -->
    <section class="trusted-section">
      <div class="section-inner">
        <p>{{ $t('trusted.title') }} <span class="highlight">{{ $t('trusted.country') }}</span></p>
        <div class="brand-logos">
          <div v-for="brand in trustedBrands" :key="brand" class="brand-logo">{{ brand }}</div>
        </div>
      </div>
    </section>

    <!-- Get Started Steps (Tradix-inspired) -->
    <section class="steps-section">
      <div class="section-inner">
        <h2>{{ $t('steps.title') }}</h2>
        <div class="steps-grid">
          <div v-for="(step, i) in steps" :key="step.title" class="step-card">
            <div class="step-number">{{ i + 1 }}</div>
            <h3>{{ $t(step.titleKey) }}</h3>
            <p>{{ $t(step.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features-section">
      <div class="section-inner">
        <h2>{{ $t('features.title') }}</h2>
        <p class="section-sub centered">{{ $t('features.subtitle') }}</p>
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.titleKey" class="feature-card">
            <div class="feature-icon" v-html="feature.icon"></div>
            <h3>{{ $t(feature.titleKey) }}</h3>
            <p>{{ $t(feature.descKey) }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section class="cta-section">
      <div class="section-inner cta-inner">
        <h2>{{ $t('cta.title') }}</h2>
        <p>{{ $t('cta.subtitle') }}</p>
        <NuxtLink to="/map" class="btn-primary-lg">{{ $t('cta.button') }}</NuxtLink>
      </div>
    </section>

  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { ref, computed } from 'vue'

const fuelType = ref('eurodiesel')
const liters = ref(50)

const fuelCompanies = ref([
  {
    id: 1, name: 'NIS Petrol', slug: 'nis', initials: 'NIS', color: '#0066cc',
    fuelType: 'Euro Diesel', price: 195.0, change: 0.52, stations: 312,
    sparkline: '0,28 20,22 40,18 60,24 80,12 100,16 120,8',
    isLowest: false
  },
  {
    id: 2, name: 'OMV', slug: 'omv', initials: 'OMV', color: '#003da5',
    fuelType: 'Euro Diesel', price: 198.5, change: 1.24, stations: 89,
    sparkline: '0,20 20,16 40,22 60,14 80,18 100,10 120,14',
    isLowest: false
  },
  {
    id: 3, name: 'Eco', slug: 'eco', initials: 'ECO', color: '#2ecc71',
    fuelType: 'Euro Diesel', price: 194.0, change: -0.31, stations: 45,
    sparkline: '0,24 20,20 40,16 60,20 80,14 100,18 120,10',
    isLowest: true
  },
  {
    id: 4, name: 'MOL', slug: 'mol', initials: 'MOL', color: '#00843d',
    fuelType: 'Euro Diesel', price: 196.5, change: 0.78, stations: 67,
    sparkline: '0,18 20,22 40,16 60,20 80,12 100,16 120,20',
    isLowest: false
  },
  {
    id: 5, name: 'Lukoil', slug: 'lukoil', initials: 'LK', color: '#e30613',
    fuelType: 'Euro Diesel', price: 197.0, change: 0.45, stations: 52,
    sparkline: '0,22 20,18 40,24 60,16 80,20 100,14 120,18',
    isLowest: false
  },
  {
    id: 6, name: 'Petrol', slug: 'petrol', initials: 'PT', color: '#ff6600',
    fuelType: 'Euro Diesel', price: 196.0, change: -0.12, stations: 38,
    sparkline: '0,16 20,20 40,14 60,18 80,22 100,16 120,12',
    isLowest: false
  }
])

const trustedBrands = ['NIS Petrol', 'OMV', 'MOL', 'Lukoil', 'Eco', 'Petrol']

const steps = [
  { titleKey: 'steps.step1.title', descKey: 'steps.step1.desc' },
  { titleKey: 'steps.step2.title', descKey: 'steps.step2.desc' },
  { titleKey: 'steps.step3.title', descKey: 'steps.step3.desc' }
]

const features = [
  {
    titleKey: 'features.liveMap.title',
    descKey: 'features.liveMap.desc',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="currentColor"/></svg>'
  },
  {
    titleKey: 'features.calculator.title',
    descKey: 'features.calculator.desc',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" fill="currentColor"/></svg>'
  },
  {
    titleKey: 'features.trends.title',
    descKey: 'features.trends.desc',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" fill="currentColor"/></svg>'
  },
  {
    titleKey: 'features.mobile.title',
    descKey: 'features.mobile.desc',
    icon: '<svg viewBox="0 0 24 24" width="28" height="28"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" fill="currentColor"/></svg>'
  }
]

const savings = computed(() => {
  const prices = fuelCompanies.value.map(c => c.price)
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length
  const cheapest = Math.min(...prices)
  return (avg - cheapest) * liters.value
})

</script>

<style scoped>
.landing {
  overflow-x: hidden;
}

.hero {
  padding: 140px 24px 80px;
  background: var(--landing-hero-bg);
  position: relative;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--primary-glow) 0%, transparent 70%);
  pointer-events: none;
}
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 80px;
  align-items: center;
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
.hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  font-weight: 800;
  margin-bottom: 24px;
  letter-spacing: -0.03em;
}
.highlight { 
  background: linear-gradient(90deg, #3861fb, #00e676);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}
.hero-sub {
  color: var(--text-muted);
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 40px;
  max-width: 500px;
}
.hero-cta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.btn-primary-lg {
  background: var(--primary);
  color: #fff;
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-primary-lg:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(0, 230, 118, 0.45);
}
.btn-outline-lg {
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-outline-lg:hover {
  background: rgba(0, 230, 118, 0.08);
}

/* Widget */
.widget-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--primary-border);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 30px 60px var(--shadow-color), 0 0 40px var(--primary-glow);
  position: relative;
  z-index: 2;
  transform: translateY(-10px);
}
.widget-title {
  font-size: 1.1rem;
  margin-bottom: 24px;
  color: var(--text-main);
}
.widget-field {
  margin-bottom: 16px;
}
.widget-field label {
  display: block;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}
.widget-field select,
.widget-field input {
  width: 100%;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 12px 14px;
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  outline: none;
}
.widget-result {
  background: var(--primary-subtle);
  border: 1px solid var(--primary-border);
  border-radius: 12px;
  padding: 16px;
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.result-label { color: var(--text-muted); font-size: 0.9rem; }
.result-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
}
.result-value small { font-size: 0.9rem; color: var(--text-muted); }
.btn-widget {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: var(--primary);
  color: #ffffff;
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-widget:hover { box-shadow: 0 4px 20px var(--primary-glow); }

/* ── Companies Section ── */
.companies-section {
  padding: 80px 24px;
  background: var(--bg-color);
}
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.section-badge {
  display: inline-block;
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 12px;
}
.companies-section h2 {
  font-size: clamp(1.8rem, 3vw, 2.4rem);
  margin-bottom: 12px;
}
.section-sub {
  color: var(--text-muted);
  font-size: 1.05rem;
  margin-bottom: 40px;
  max-width: 560px;
}
.section-sub.centered {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.company-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}
.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  border-color: var(--primary-border);
}
.company-card.best-price {
  border-color: var(--primary);
  box-shadow: 0 0 30px var(--primary-glow);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}
.company-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.75rem;
  color: #fff;
  flex-shrink: 0;
}
.company-meta h3 {
  font-size: 1rem;
  margin-bottom: 2px;
}
.fuel-type-tag {
  font-size: 0.75rem;
  color: var(--text-muted);
}
.lowest-badge {
  margin-left: auto;
  background: var(--primary);
  color: #ffffff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}
.card-price {
  margin-bottom: 8px;
}
.price-amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
}
.price-unit {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-left: 4px;
}
.card-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
}
.card-change.up { color: var(--success); }
.card-change.down { color: #ff4757; }
.change-period {
  color: var(--text-muted);
  font-weight: 400;
}
.sparkline {
  width: 100%;
  height: 32px;
  margin-bottom: 16px;
  opacity: 0.8;
}
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 14px;
}
.stations-count {
  font-size: 0.8rem;
  color: var(--text-muted);
}
.card-link {
  color: var(--primary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}
.card-link:hover { text-decoration: underline; }

/* ── Trusted ── */
.trusted-section {
  padding: 50px 24px;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  background: var(--landing-section-alt);
}
.trusted-section p {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: 28px;
  font-size: 1rem;
}
.brand-logos {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 32px;
}
.brand-logo {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-muted);
  opacity: 0.6;
  letter-spacing: 0.02em;
}

/* ── Steps ── */
.steps-section {
  padding: 80px 24px;
}
.steps-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 48px;
}
.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.step-card {
  text-align: center;
  padding: 32px 24px;
}
.step-number {
  width: 48px;
  height: 48px;
  background: var(--primary);
  color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.2rem;
  margin: 0 auto 20px;
}
.step-card h3 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}
.step-card p {
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

/* ── Features ── */
.features-section {
  padding: 80px 24px;
  background: var(--landing-section-alt);
}
.features-section h2 {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 12px;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 48px;
}
.feature-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 28px 24px;
  transition: border-color 0.2s;
}
.feature-card:hover { border-color: var(--primary-border); }
.feature-icon {
  color: var(--primary);
  margin-bottom: 16px;
}
.feature-card h3 {
  font-size: 1rem;
  margin-bottom: 8px;
}
.feature-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* ── CTA ── */
.cta-section {
  padding: 80px 24px;
  background: linear-gradient(135deg, var(--primary-subtle) 0%, transparent 60%);
}
.cta-inner {
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

/* ── Responsive ── */
@media (max-width: 900px) {
  .hero-inner { grid-template-columns: 1fr; gap: 40px; }
  .steps-grid { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .features-grid { grid-template-columns: 1fr; }
  .companies-grid { grid-template-columns: 1fr; }
}
</style>
