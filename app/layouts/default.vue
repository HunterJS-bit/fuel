<template>
  <div class="app-container">
    <div class="header glass-panel">
      <div class="logo-area">
        <NuxtLink to="/" class="logo-link">
          <div class="title glow-text">1-2-3 Fuel</div>
        </NuxtLink>
      </div>

      <nav class="top-nav">
        <NuxtLink to="/map" class="nav-item" active-class="active"
          >Map</NuxtLink
        >
        <NuxtLink to="/nearby" class="nav-item" active-class="active"
          >Nearby</NuxtLink
        >
        <NuxtLink to="/contact" class="nav-item" active-class="active"
          >Contact</NuxtLink
        >
      </nav>

      <div class="controls">
        <div class="fuel-type-selector">
          <select v-model="selectedFuel">
            <option value="eurodiesel">Euro Diesel</option>
            <option value="bmb95">BMB 95</option>
            <option value="lpg">LPG</option>
          </select>
        </div>
        <button
          class="theme-toggle"
          @click="toggleTheme"
          title="Toggle Light/Dark Mode"
        >
          <svg v-if="isDark" viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"
              fill="currentColor"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24" width="20" height="20">
            <path
              d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8 8h-2v3h2v-3zm-7.45-3.91l1.41 1.41 1.79-1.79-1.41-1.41-1.79 1.79zM12 5.5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="app-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const selectedFuel = ref("eurodiesel");
const isDark = ref(true);

const toggleTheme = () => {
  isDark.value = !isDark.value;
  if (process.client) {
    if (isDark.value) {
      document.documentElement.classList.remove("light-mode");
    } else {
      document.documentElement.classList.add("light-mode");
    }
  }
};

onMounted(() => {
  if (process.client) {
    isDark.value = !document.documentElement.classList.contains("light-mode");
  }
});
</script>

<style scoped>
.header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  border-radius: 0 0 20px 20px;
}
.logo-area {
  display: flex;
  align-items: center;
}
.logo-link {
  text-decoration: none;
  color: inherit;
}
.title {
  font-size: 1.5rem;
  font-weight: 700;
}
.top-nav {
  display: flex;
  gap: 30px;
}
.controls {
  display: flex;
  align-items: center;
  gap: 15px;
}
.fuel-type-selector select {
  background: var(--panel-bg);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  border-radius: 8px;
  outline: none;
  font-family: "Outfit", sans-serif;
  cursor: pointer;
}
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
  transition: all 0.3s;
}
.theme-toggle:hover {
  background: rgba(100, 100, 100, 0.1);
}
</style>
