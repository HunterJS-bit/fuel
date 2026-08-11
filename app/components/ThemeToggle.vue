<template>
  <button
    class="theme-toggle"
    :title="isDark ? 'Uključi svetlu temu' : 'Uključi tamnu temu'"
    @click="toggleTheme"
  >
    <svg v-if="isDark" viewBox="0 0 24 24" width="20" height="20">
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" fill="currentColor"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" width="20" height="20">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z" fill="currentColor"/>
    </svg>
  </button>
</template>

<script setup>
const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.theme-toggle {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, border-color 0.2s;
}
.theme-toggle:hover {
  background: var(--hover-bg);
}
</style>
