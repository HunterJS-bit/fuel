<template>
  <div class="list-container">
    <div class="list-header">
      <h2>Station List</h2>
      <p>Nearest & Cheapest in Belgrade</p>
    </div>
    
    <div class="station-list">
      <div v-for="station in sortedStations" :key="station.id" class="station-card glass-panel">
        <div class="station-info">
          <h3 class="station-name">{{ station.name }}</h3>
          <p class="station-dist">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            {{ station.dist }} km
          </p>
        </div>
        <div class="station-price">
          <div class="price-tag" :class="{ 'cheap': station.price <= 195 }">
            {{ station.price.toFixed(1) }} <span>RSD</span>
          </div>
          <button class="btn-primary route-btn">Route</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const stations = [
  { id: 1, name: 'NIS Petrol', dist: 1.2, price: 195.0, type: 'NIS' },
  { id: 2, name: 'OMV', dist: 1.8, price: 198.5, type: 'OMV' },
  { id: 3, name: 'Eco', dist: 0.9, price: 194.0, type: 'Eco' },
  { id: 4, name: 'MOL', dist: 2.5, price: 196.5, type: 'MOL' },
  { id: 5, name: 'Lukoil', dist: 3.1, price: 197.0, type: 'Lukoil' }
]

const sortedStations = computed(() => {
  return [...stations].sort((a,b) => a.price - b.price)
})
</script>

<style scoped>
.list-container {
  padding: 90px 20px 100px; /* Leave space for header and bottom nav */
  min-height: 100vh;
  background: var(--bg-color);
  position: relative;
  z-index: 2; /* above map conceptually though this is a different page */
}
.list-header {
  margin-bottom: 20px;
}
.list-header h2 {
  font-size: 2rem;
  color: var(--primary);
  text-shadow: 0 0 10px var(--primary-glow);
}
.list-header p {
  color: var(--text-muted);
}
.station-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.station-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  transition: transform 0.2s ease;
}
.station-card:hover {
  transform: scale(1.02);
}
.station-name {
  font-size: 1.2rem;
  margin-bottom: 4px;
}
.station-dist {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 4px;
}
.station-dist svg {
  fill: var(--text-muted);
}
.station-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.price-tag {
  color: var(--text-main);
}
.price-tag.cheap {
  color: var(--primary);
}
.price-tag span {
  font-size: 0.8rem;
  opacity: 0.7;
}
.route-btn {
  padding: 6px 12px;
  font-size: 0.85rem;
}
</style>
