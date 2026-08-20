<template>
  <div class="nearby-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <h1 class="page-title">Fuel Stations Near You</h1>
        <p class="subtitle">Find the best prices and save on your next fill-up.</p>
      </div>

      <div class="trend-widget glass-panel">
        <div class="trend-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
          </svg>
        </div>
        <div class="trend-info">
          <h3>Good Time to Fill Up!</h3>
          <p>Prices are currently low in your area. Don't wait.</p>
        </div>
      </div>

      <div class="search-container">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" class="search-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" v-model="searchQuery" class="location-search" placeholder="Search by postcode, town, or address..." />
      </div>

      <div class="stations-feed">
        <!-- <h4 class="feed-title">Nearest Stations ({{filteredStations.length}})</h4> -->
        <div 
          v-for="(station, idx) in filteredStations" 
          :key="station.id" 
          class="station-card glass-panel" 
          :class="{ 'best-price': idx === 0, 'is-expanded': expandedStationId === station.id }"
          @mouseover="hoveredStation = station.id"
          @mouseleave="hoveredStation = null"
        >
          <div v-if="idx === 0" class="best-badge">🏆 Best Price</div>
          <div class="card-header" @click="toggleExpanded(station.id)">
            <div class="brand-col">
              <div class="brand-logo" :class="station.type?.toLowerCase() || 'nis'">
                {{ station.brand?.charAt(0) || 'N' }}
              </div>
            </div>
            <div class="details-col">
              <h3 class="s-name">{{ station.name }}</h3>
              <div class="s-meta">
                <span class="brand">{{ station.brand }}</span>
                <span class="updated">{{ station.city }}</span>
              </div>
            </div>
            <div class="price-col">
              <div class="price-value">{{ (station.price || 0).toFixed(1) }}</div>
              <div class="price-currency">RSD</div>
              <div class="expand-icon" :class="{ 'expanded': expandedStationId === station.id }">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" class="chevron" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="card-accordion" v-show="expandedStationId === station.id">
            <div class="acc-content">
              <div class="acc-row">
                <div class="acc-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg></div>
                <div class="acc-text">{{ station.address }}</div>
              </div>
              <div class="acc-row" v-if="station.hours">
                <div class="acc-icon"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg></div>
                <div class="acc-text" :class="{ 'text-success': station.hours.includes('00-24') }">{{ station.hours }}</div>
              </div>
              <div class="acc-row fuels-row">
                <div class="acc-icon" style="margin-top: 4px;"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v6h18V2H3zm2 4V4h14v2H5zm-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8H3zm3 4h12v2H6v-2z"></path></svg></div>
                <div class="s-fuels">
                  <span v-for="f in station.fuels" :key="f" class="fuel-badge">{{ f }}</span>
                </div>
              </div>
              <div class="acc-actions">
                <button class="nav-btn btn-primary" title="Get Directions">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="map-section">
      <ClientOnly>
        <div id="sticky-map"></div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup >
definePageMeta({ layout: 'landing' })


import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import stationsData  from "../data/stations.json";

const searchQuery = ref('')
const stations = ref([])

const sortedStations = computed(() => {
  return [...stations.value].sort((a,b) => (a.price || 0) - (b.price || 0))
})

const hoveredStation = ref(null)
const expandedStationId = ref(null)
let leafletMap = null


const toggleExpanded = (id) => {
  // if (expandedStationId.value === id) {
  //   expandedStationId.value = null
  // } else {
  //   expandedStationId.value = id
  // }
}
let markers = {}
let mutationObserver = null


onMounted(async () => {
  if (process.client) {
    // Fetch real station data
    const fetchedStations = stationsData
    stations.value = fetchedStations.length > 0 ? fetchedStations : []

    const L = await import('leaflet')
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    })

    const serbiaBounds = L.latLngBounds([41.8, 18.8], [46.2, 23.0])
    leafletMap = L.map('sticky-map', {
      zoomControl: true,
      zoomAnimation: true,
      maxBounds: serbiaBounds,
      maxBoundsViscosity: 1.0,
      minZoom: 6
    }).setView([44.0, 21.0], 7)

    // React to theme changes using MutationObserver
    const isLightMode = document.documentElement.classList.contains('light-mode')
    
    let currentTileLayer = L.tileLayer(
      isLightMode ? 
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' : 
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', 
    {
      attribution: '&copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(leafletMap)

    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const lightNow = document.documentElement.classList.contains('light-mode')
          const newUrl = lightNow ? 
            'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png' : 
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          currentTileLayer.setUrl(newUrl)
        }
      })
    })

    mutationObserver.observe(document.documentElement, { attributes: true })

    sortedStations.value.forEach(station => {
      const isBest = station.id === sortedStations.value[0].id
      const priceIcon = L.divIcon({
        className: 'nearby-price-marker',
        html: `<div class="p-marker ${isBest ? 'best' : ''}" id="marker-${station.id}">
                 <span>${station.price}</span>
               </div>`,
        iconSize: [60, 30],
        iconAnchor: [30, 15]
      })

      const m = L.marker([station.latitude, station.longitude], { icon: priceIcon })
        .addTo(leafletMap)
        .bindPopup(`<b>${station.name}</b><br>${station.address}, ${station.city}<br>${station.price} RSD`)
        .on('click', () => {
          expandedStationId.value = station.id
        })
      
      markers[station.id] = { marker: m, elId: `marker-${station.id}` }
    })
  }
})

onUnmounted(() => {
  if (mutationObserver) {
    mutationObserver.disconnect()
  }
})

</script>

<style scoped>
.nearby-container {
  display: flex;
  height: 100vh;
  padding-top: 75px; 
  background: var(--bg-color);
  overflow: hidden;
}

.sidebar {
  width: 480px;
  min-width: 400px;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  z-index: 2;
  box-shadow: 4px 0 24px rgba(0,0,0,0.05);
}

.sidebar-header {
  padding: 10px 0;
}
.page-title {
  font-size: 2.2rem;
  color: var(--text-main);
  line-height: 1.2;
}
.subtitle {
  color: var(--text-muted);
  margin-top: 8px;
  font-size: 1rem;
}

.trend-widget {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.02));
  border: 1px solid rgba(34, 197, 94, 0.2);
}
.trend-icon {
  background: rgba(34, 197, 94, 0.2);
  color: var(--success);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.trend-icon svg {
  width: 24px;
  height: 24px;
}
.trend-info h3 {
  color: var(--success);
  margin-bottom: 4px;
  font-size: 1.15rem;
  font-weight: 700;
}
.trend-info p {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.4;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: 14px;
  color: var(--text-muted);
}
.location-search {
  width: 100%;
  padding: 14px 14px 14px 42px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.02);
}
.location-search:focus {
  border-color: var(--primary);
  box-shadow: 0 4px 15px var(--primary-glow);
}

.feed-title {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stations-feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
}

.station-card {
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  padding: 20px;
}
.station-card:hover {
  transform: translateY(-4px);
  border-color: var(--primary);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.station-card.best-price {
  border: 1px solid var(--primary);
  background: linear-gradient(to right, var(--glass-bg), rgba(56, 97, 251, 0.05));
}
.best-badge {
  position: absolute;
  top: -12px;
  right: 20px;
  background: var(--primary);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  box-shadow: 0 4px 10px var(--primary-glow);
}

.card-header {
  display: flex;
  gap: 16px;
  align-items: center;
}
.brand-col {
  flex-shrink: 0;
}
.brand-logo {
  width: 54px;
  height: 54px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.brand-logo.nis { background: linear-gradient(135deg, #004d96, #002b5e); }
.brand-logo.omv { background: linear-gradient(135deg, #007646, #004d2e); }
.brand-logo.eco { background: linear-gradient(135deg, #e31837, #9b0b20); }
.brand-logo.mol { background: linear-gradient(135deg, #e3000f, #99000a); }

.details-col {
  flex: 1;
}
.s-name {
  font-size: 1.3rem;
  margin-bottom: 4px;
  color: var(--text-main);
}
.card-accordion {
  border-top: 1px solid var(--border-color);
  margin-top: 16px;
  padding-top: 16px;
}
.acc-row {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}
.acc-icon {
  color: var(--text-muted);
  display: flex;
  align-items: flex-start;
  margin-top: 2px;
}
.acc-text {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.4;
}
.text-success {
  color: var(--success) !important;
}
.fuels-row {
  align-items: center;
}
.s-fuels {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.fuel-badge {
  background: rgba(0,0,0,0.05);
  color: var(--text-main);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
}
html.dark-mode .fuel-badge {
  background: rgba(255,255,255,0.1);
}
.acc-actions {
  margin-top: 16px;
  display: flex;
}
.nav-btn.btn-primary {
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.expand-icon {
  color: var(--text-muted);
  margin-top: 8px;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: flex-end;
}
.expand-icon.expanded {
  transform: rotate(180deg);
}
.s-meta {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
}
.dist {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--primary);
  font-weight: 600;
}
.updated {
  color: var(--text-muted);
}

.price-col {
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}
.price-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}
.price-currency {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
  margin-top: -4px;
}
.nav-btn {
  padding: 8px 14px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-btn svg {
  display: block;
}

.map-section {
  flex: 1;
  position: relative;
  z-index: 1;
}
#sticky-map {
  width: 100%;
  height: 100%;
}

@media (max-width: 900px) {
  .nearby-container {
    flex-direction: column-reverse;
  }
  .sidebar {
    width: 100%;
    min-width: auto;
    height: 60vh;
    padding: 16px;
  }
  .map-section {
    height: 40vh;
    flex: none;
  }
}
</style>

<style>
/* Unscoped global map styles for new markers */
.nearby-price-marker {
  display: flex;
  justify-content: center;
  align-items: center;
}
.p-marker {
  background: var(--panel-bg);
  border: 2px solid var(--border-color);
  color: var(--text-main);
  border-radius: 8px;
  padding: 4px 10px;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
  transition: all 0.2s ease;
  white-space: nowrap;
}
.p-marker.best {
  border-color: var(--primary);
  background: rgba(56, 97, 251, 0.1);
  color: var(--primary);
  box-shadow: 0 4px 15px var(--primary-glow);
}
.p-marker.hovered {
  transform: scale(1.15) translateY(-5px);
  border-color: var(--success);
  background: rgba(34, 197, 94, 0.1);
  color: var(--success);
  z-index: 1000 !important;
}
</style>
