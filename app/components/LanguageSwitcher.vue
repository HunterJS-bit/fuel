<template>
  <div class="language-switcher">
    <button 
      v-for="locale in availableLocales" 
      :key="locale.code"
      class="lang-btn"
      :class="{ active: currentLocale === locale.code }"
      @click="switchLanguage(locale.code)"
    >
      {{ locale.name }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const { locale, setLocale } = useI18n()

const availableLocales = [
  { code: 'en', name: 'EN' },
  { code: 'sr', name: 'SR' }
]

const currentLocale = computed(() => locale.value)

const switchLanguage = (code) => {
  setLocale(code)
}
</script>

<style scoped>
.language-switcher {
  display: flex;
  gap: 4px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 4px;
}

.lang-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.lang-btn:hover {
  color: var(--text-main);
  background: var(--hover-bg);
}

.lang-btn.active {
  background: var(--fuel-gradient);
  color: var(--on-primary);
}
</style>
