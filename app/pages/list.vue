<template>
  <div class="list-container">
    <div class="list-header">
      <h2>Cheapest Fuel Nearby</h2>
      <p>Find. Compare. Save.</p>
    </div>

    <!-- Savings Calculator -->
    <div class="savings-calculator glass-panel">
      <h3>Ready to save on fuel?</h3>
      <div class="calc-row">
        <span>If you refuel</span>
        <select v-model="liters" class="l-select">
          <option value="30">30 Liters</option>
          <option value="40">40 Liters</option>
          <option value="50">50 Liters</option>
          <option value="60">60 Liters</option>
        </select>
      </div>
      <div class="savings-result">
        You save <span class="highlight-save">{{ calculatedSavings.toFixed(2) }} RSD</span> 
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-row">
      <input type="text" class="filter-input" placeholder="Search address or brand..." v-model="searchQuery" />
      <select class="filter-select">
        <option value="">All Companies</option>
        <option value="NIS Petrol">NIS Petrol</option>
        <option value="OMV">OMV</option>
        <option value="Eco">Eco</option>
        <option value="MOL">MOL</option>
      </select>
    </div>
    
    <!-- Station List -->
    <div class="station-list">
      <div v-for="(station, index) in filteredStations" :key="station.id" class="station-card glass-panel" :class="{'cheapest-card': index === 0}">
        
        <div class="station-info">
          <div v-if="index === 0" class="badge-cheapest">Lowest Price</div>
          <h3 class="station-name">{{ station.name }}</h3>
          <p class="station-dist">
            <svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            {{ station.dist }} km • <span class="status-dot"></span> Active
          </p>
        </div>

        <div class="station-actions">
          <div class="price-section">
            <div class="price-tag" :class="{ 'cheap': station.price <= 195 }">
              {{ station.price.toFixed(1) }} <span>RSD</span>
            </div>
          </div>
          <div class="btn-group">
            <button class="btn-outline btn-sm">Correct Price</button>
            <button class="btn-primary btn-sm route-btn">Navigate</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const stations = [
  { id: 1, name: 'NIS Petrol', dist: 1.2, price: 195.0, type: 'NIS Petrol' },
  { id: 2, name: 'OMV', dist: 1.8, price: 198.5, type: 'OMV' },
  { id: 3, name: 'Eco', dist: 0.9, price: 194.0, type: 'Eco' },
  { id: 4, name: 'MOL', dist: 2.5, price: 196.5, type: 'MOL' },
  { id: 5, name: 'Lukoil', dist: 3.1, price: 197.0, type: 'Lukoil' }
]

const liters = ref(50)
const searchQuery = ref('')

const sortedStations = computed(() => {
  return [...stations].sort((a,b) => a.price - b.price)
})

const filteredStations = computed(() => {
  return sortedStations.value.filter(s => s.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

// Calculate savings based on the difference between average price and the cheapest price
const calculatedSavings = computed(() => {
  if (sortedStations.value.length === 0) return 0;
  const avgPrice = sortedStations.value.reduce((acc, s) => acc + s.price, 0) / sortedStations.value.length;
  const cheapestPrice = sortedStations.value[0].price;
  const diffPerLiter = avgPrice - cheapestPrice;
  return diffPerLiter * liters.value;
})
</script>

<style scoped>
.list-container {
  padding: 90px 20px 20px;
  min-height: 100vh;
  background: var(--bg-color);
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
}
.list-header {
  margin-bottom: 20px;
}
.list-header h2 {
  font-size: 2rem;
  color: var(--primary);
}
.list-header p {
  color: var(--text-muted);
}

.savings-calculator {
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: var(--panel-bg);
}
.savings-calculator h3 {
  font-size: 1.2rem;
  color: var(--text-main);
}
.calc-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.l-select {
  background: var(--bg-color);
  color: var(--text-main);
  border: 1px solid var(--border-color);
  padding: 6px 12px;
  border-radius: 8px;
  outline: none;
}
.savings-result {
  font-size: 1.1rem;
  margin-top: 10px;
}
.highlight-save {
  color: var(--secondary);
  font-weight: bold;
  font-size: 1.3rem;
  background-color: var(--primary);
  padding: 2px 8px;
  border-radius: 6px;
  display: inline-block;
}
html.light-mode .highlight-save {
  color: #fff;
  background-color: var(--primary);
}

.filters-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.filter-input, .filter-select {
  flex: 1;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 10px 15px;
  border-radius: 8px;
  outline: none;
}

.station-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.station-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;
}
.cheapest-card {
  border-color: var(--primary);
  box-shadow: 0 4px 15px var(--primary-glow);
}
.badge-cheapest {
  font-size: 0.75rem;
  background: var(--primary);
  color: var(--panel-bg);
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 700;
  display: inline-block;
  margin-bottom: 8px;
}
.station-name {
  font-size: 1.2rem;
  margin-bottom: 6px;
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
.status-dot {
  width: 8px;
  height: 8px;
  background-color: #00e676;
  border-radius: 50%;
  display: inline-block;
}

.station-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}
.price-section {
  text-align: right;
}
.price-tag {
  color: var(--text-main);
  font-size: 1.5rem;
  font-weight: bold;
}
.btn-group {
  display: flex;
  gap: 8px;
}
.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}
.btn-outline {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-main);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.05);
}
.btn-primary {
  background: var(--primary);
  border: 1px solid var(--primary);
  color: var(--panel-bg);
}
html.light-mode .btn-primary {
  color: #fff;
}
</style>
