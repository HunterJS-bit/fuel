<template>
  <header class="landing-nav">
    <div class="nav-inner">
      <NuxtLink to="/" class="brand">
        <span class="brand-icon">⛽</span>
        <span class="brand-name">III <em>Fuel</em></span>
      </NuxtLink>

      <nav class="nav-links">
        <NuxtLink to="/nearby">{{ $t('nav.map') }}</NuxtLink>
        <NuxtLink to="/charging">{{ $t('nav.charging') }}</NuxtLink>
        <NuxtLink to="/blog">{{ $t('nav.blog') }}</NuxtLink>
        <NuxtLink to="/faq">{{ $t('nav.faq') }}</NuxtLink>
        <NuxtLink to="/contact">{{ $t('nav.contact') }}</NuxtLink>
      </nav>

      <div class="nav-actions">
        <LanguageSwitcher />
        <button class="theme-btn" @click="toggleTheme" title="Toggle theme">
          <svg v-if="isDark" viewBox="0 0 24 24" width="18" height="18"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/></svg>
          <svg v-else viewBox="0 0 24 24" width="18" height="18"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" fill="currentColor"/></svg>
        </button>
        <NuxtLink v-if="showCta" to="/nearby" class="btn-nav-primary">{{ $t('nav.getStarted') }}</NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { onMounted } from 'vue'

const { isDark, toggleTheme, initTheme } = useTheme()

defineProps({
  showCta: {
    type: Boolean,
    default: true
  }
})

onMounted(() => {
  initTheme()
})
</script>

<style scoped>
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
.btn-nav-primary {
  background: var(--primary);
  color: #fff;
  padding: 10px 22px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-nav-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px var(--primary-glow);
}

@media (max-width: 900px) {
  .nav-links { display: none; }
}
</style>
