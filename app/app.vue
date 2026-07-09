<template>
  <div class="app-container">
    <div class="header glass-panel">
      <div class="fuel-type-selector">
        <select v-model="selectedFuel">
          <option value="eurodiesel">Euro Diesel</option>
          <option value="bmb95">BMB 95</option>
          <option value="lpg">LPG</option>
        </select>
      </div>
      <div class="title glow-text">1-2-3 Fuel Serbia</div>
    </div>
    
    <div class="app-content">
      <NuxtPage />
    </div>

    <nav class="bottom-nav glass-panel">
      <NuxtLink to="/" class="nav-item" active-class="active">
        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        Map
      </NuxtLink>
      <NuxtLink to="/list" class="nav-item" active-class="active">
        <svg viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>
        List
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedFuel = ref('eurodiesel')
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
  padding: 15px 20px;
  border-radius: 0 0 20px 20px;
}
.title {
  font-size: 1.2rem;
  font-weight: 700;
}
.fuel-type-selector select {
  background: rgba(0,0,0,0.3);
  color: white;
  border: 1px solid var(--border-color);
  padding: 8px 12px;
  border-radius: 8px;
  outline: none;
  font-family: 'Outfit', sans-serif;
  cursor: pointer;
}
</style>
