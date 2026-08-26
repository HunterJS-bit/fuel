<template>
  <div class="charging-container">
    <div class="sidebar">
      <div class="sidebar-header">
        <div class="header-badge">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/>
          </svg>
          {{ $t('charging.badge') }}
        </div>
        <h1 class="page-title">{{ $t('charging.title') }}</h1>
        <p class="subtitle">{{ $t('charging.subtitle') }}</p>
      </div>

      <div class="stats-row">
        <div class="stat-chip">
          <span class="stat-value">{{ stations.length }}</span>
          <span class="stat-label">{{ $t('charging.stats.stations') }}</span>
        </div>
        <div class="stat-chip available">
          <span class="stat-value">{{ totalAvailable }}</span>
          <span class="stat-label">{{ $t('charging.stats.available') }}</span>
        </div>
        <div class="stat-chip">
          <span class="stat-value">{{ maxPower }} kW</span>
          <span class="stat-label">{{ $t('charging.stats.maxPower') }}</span>
        </div>
      </div>

      <div class="search-container">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" class="search-icon" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          class="location-search"
          :placeholder="$t('charging.searchPlaceholder')"
        />
      </div>

      <div class="filter-chips">
        <button
          v-for="filter in typeFilters"
          :key="filter.key"
          class="chip"
          :class="{ active: activeFilter === filter.key }"
          :style="filter.key !== 'all' ? { '--chip-color': filter.color } : {}"
          @click="activeFilter = filter.key"
        >
          <span v-if="filter.key !== 'all'" class="chip-dot" :style="{ background: filter.color }"></span>
          {{ $t(filter.labelKey) }}
        </button>
      </div>

      <div class="stations-feed">
        <div
          v-for="station in filteredStations"
          :key="station.id"
          class="station-card glass-panel"
          :class="{
            selected: selectedStationId === station.id,
            [`status-${getAvailabilityStatus(station.available, station.stalls)}`]: true
          }"
          @click="selectStation(station)"
          @mouseenter="hoveredStationId = station.id"
          @mouseleave="hoveredStationId = null"
        >
          <div class="card-top">
            <div
              class="type-badge"
              :style="{
                color: chargerConfig[station.primaryType].color,
                background: chargerConfig[station.primaryType].bg
              }"
            >
              {{ chargerConfig[station.primaryType].icon }}
              {{ $t(chargerConfig[station.primaryType].labelKey) }}
            </div>
            <div class="availability" :class="getAvailabilityStatus(station.available, station.stalls)">
              <span class="avail-dot"></span>
              {{ station.available }}/{{ station.stalls }}
              {{ $t(`charging.status.${getAvailabilityStatus(station.available, station.stalls)}`) }}
            </div>
          </div>

          <h3 class="s-name">{{ station.name }}</h3>
          <div class="s-network">{{ station.network }} · {{ station.city }}</div>

          <div class="card-specs">
            <div class="spec">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M11 21h-1l1-7H7.5c-.58 0-.57-.32-.38-.66.19-.34.05-.08.07-.12C8.48 10.94 10.42 7.54 13 3h1l-1 7h3.5c.49 0 .56.33.47.51l-.07.15C12.96 17.55 11 21 11 21z"/></svg>
              <strong>{{ station.powerKw }} kW</strong>
            </div>
            <div class="spec">
              <strong>{{ station.pricePerKwh }}</strong> RSD/kWh
            </div>
            <div class="spec hours" :class="{ 'always-open': station.hours === '00-24' }">
              {{ station.hours }}
            </div>
          </div>

          <div class="connectors-row">
            <span
              v-for="conn in station.connectors"
              :key="conn"
              class="connector-tag"
              :style="{ borderColor: chargerConfig[conn].color, color: chargerConfig[conn].color }"
            >
              {{ chargerConfig[conn].icon }}
            </span>
          </div>

          <div v-if="selectedStationId === station.id" class="card-expanded">
            <p class="address">{{ station.address }}, {{ station.city }}</p>
            <div v-if="station.amenities.length" class="amenities">
              <span v-for="a in station.amenities" :key="a" class="amenity">{{ $t(`charging.amenities.${a}`) }}</span>
            </div>
            <button class="nav-btn btn-primary">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
              {{ $t('charging.getDirections') }}
            </button>
          </div>
        </div>

        <p v-if="filteredStations.length === 0" class="empty-feed">
          {{ $t('charging.noResults') }}
        </p>
      </div>
    </div>

    <div class="map-section">
      <ClientOnly>
        <div id="charging-map"></div>
      </ClientOnly>

      <div class="map-legend glass-panel">
        <h4>{{ $t('charging.legend') }}</h4>
        <div v-for="(cfg, type) in legendTypes" :key="type" class="legend-item">
          <span class="legend-dot" :style="{ background: cfg.color }"></span>
          <span>{{ $t(cfg.labelKey) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })

import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import chargingData from '~/data/chargingStations.json'
import { chargerConfig, getAvailabilityStatus, buildMarkerHtml } from '~/utils/chargingMarkers'

const searchQuery = ref('')
const activeFilter = ref('all')
const selectedStationId = ref(null)
const hoveredStationId = ref(null)
const stations = ref(chargingData)

let leafletMap = null
let markers = {}
let mutationObserver = null

const typeFilters = [
  { key: 'all', labelKey: 'charging.filters.all', color: null },
  { key: 'type2', labelKey: 'charging.types.type2', color: '#3b82f6' },
  { key: 'ccs', labelKey: 'charging.types.ccs', color: '#22c55e' },
  { key: 'chademo', labelKey: 'charging.types.chademo', color: '#f97316' },
  { key: 'tesla', labelKey: 'charging.types.tesla', color: '#ef4444' },
  { key: 'ultra', labelKey: 'charging.types.ultra', color: '#a855f7' }
]

const legendTypes = {
  type2: chargerConfig.type2,
  ccs: chargerConfig.ccs,
  chademo: chargerConfig.chademo,
  tesla: chargerConfig.tesla,
  ultra: chargerConfig.ultra
}

const totalAvailable = computed(() =>
  stations.value.reduce((sum, s) => sum + s.available, 0)
)

const maxPower = computed(() =>
  Math.max(...stations.value.map(s => s.powerKw))
)

const filteredStations = computed(() => {
  let result = [...stations.value]

  if (activeFilter.value !== 'all') {
    result = result.filter(s =>
      s.primaryType === activeFilter.value || s.connectors.includes(activeFilter.value)
    )
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.network.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    )
  }

  return result.sort((a, b) => b.available - a.available)
})

const selectStation = (station) => {
  selectedStationId.value = selectedStationId.value === station.id ? null : station.id
  if (leafletMap && markers[station.id]) {
    leafletMap.setView([station.latitude, station.longitude], 14, { animate: true })
    markers[station.id].marker.openPopup()
  }
  updateMarkerStyles()
}

const updateMarkerStyles = () => {
  stations.value.forEach(station => {
    const el = document.getElementById(`ev-marker-${station.id}`)
    if (el) {
      el.classList.toggle('selected', selectedStationId.value === station.id)
      el.classList.toggle('hovered', hoveredStationId.value === station.id)
    }
  })
}

watch([selectedStationId, hoveredStationId], updateMarkerStyles)

onMounted(async () => {
  if (!process.client) return

  const L = await import('leaflet')
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  const serbiaBounds = L.latLngBounds([41.8, 18.8], [46.2, 23.0])
  leafletMap = L.map('charging-map', {
    zoomControl: true,
    maxBounds: serbiaBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 6
  }).setView([44.0, 21.0], 7)

  const isLightMode = document.documentElement.classList.contains('light-mode')
  const currentTileLayer = L.tileLayer(
    isLightMode
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    { attribution: '&copy; CartoDB', subdomains: 'abcd', maxZoom: 20 }
  )
  
  currentTileLayer.addTo(leafletMap)

  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19
  })

  const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19
  })

  L.control.layers({
    "Default (Light/Dark)": currentTileLayer,
    "Streets": streetLayer,
    "Satellite": satelliteLayer
  }).addTo(leafletMap)

  mutationObserver = new MutationObserver(() => {
    const lightNow = document.documentElement.classList.contains('light-mode')
    currentTileLayer.setUrl(
      lightNow
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    )
  })
  mutationObserver.observe(document.documentElement, { attributes: true })

  renderMarkers(L)
})

const renderMarkers = (L) => {
  Object.values(markers).forEach(({ marker }) => marker.remove())
  markers = {}

  stations.value.forEach(station => {
    const cfg = chargerConfig[station.primaryType]
    const icon = L.divIcon({
      className: 'ev-charging-marker',
      html: buildMarkerHtml(station),
      iconSize: [44, 52],
      iconAnchor: [22, 52]
    })

    const popupContent = `
      <div class="ev-popup">
        <strong>${station.name}</strong><br>
        <span style="color:${cfg.color}">${station.network} · ${station.powerKw} kW</span><br>
        ${station.available}/${station.stalls} available · ${station.pricePerKwh} RSD/kWh
      </div>
    `

    const m = L.marker([station.latitude, station.longitude], { icon })
      .addTo(leafletMap)
      .bindPopup(popupContent)
      .on('click', () => {
        selectedStationId.value = station.id
        updateMarkerStyles()
      })

    markers[station.id] = { marker: m }
  })
}

onUnmounted(() => {
  mutationObserver?.disconnect()
})
</script>

<style scoped>
.charging-container {
  display: flex;
  height: calc(100vh - 71px);
  background: var(--bg-color);
  overflow: hidden;
}

.sidebar {
  width: 440px;
  min-width: 380px;
  height: 100%;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  z-index: 2;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.08);
  border-right: 1px solid var(--border-color);
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(34, 197, 94, 0.12);
  color: #22c55e;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 12px;
  border: 1px solid rgba(34, 197, 94, 0.25);
}

.page-title {
  font-size: 1.9rem;
  color: var(--text-main);
  line-height: 1.2;
  font-weight: 800;
}

.subtitle {
  color: var(--text-muted);
  margin-top: 6px;
  font-size: 0.95rem;
}

.stats-row {
  display: flex;
  gap: 10px;
}

.stat-chip {
  flex: 1;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
}

.stat-chip.available {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.06);
}

.stat-value {
  display: block;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--text-main);
}

.stat-chip.available .stat-value {
  color: #22c55e;
}

.stat-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.search-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.location-search {
  width: 100%;
  padding: 12px 12px 12px 42px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.2s;
}

.location-search:focus {
  border-color: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--border-color);
  background: var(--panel-bg);
  color: var(--text-muted);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.chip:hover {
  border-color: var(--chip-color, var(--primary));
  color: var(--text-main);
}

.chip.active {
  background: var(--chip-color, var(--primary));
  border-color: var(--chip-color, var(--primary));
  color: #fff;
}

.chip-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.stations-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 40px;
}

.station-card {
  padding: 16px;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  border-left: 3px solid transparent;
}

.station-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.station-card.selected {
  border-left-color: #22c55e;
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.3);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.type-badge {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.availability {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
}

.avail-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.availability.available { color: #22c55e; }
.availability.available .avail-dot { background: #22c55e; }
.availability.busy { color: #f97316; }
.availability.busy .avail-dot { background: #f97316; }
.availability.offline { color: #94a3b8; }
.availability.offline .avail-dot { background: #94a3b8; }

.s-name {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 4px;
}

.s-network {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 12px;
}

.card-specs {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.spec {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.82rem;
  color: var(--text-muted);
}

.spec strong {
  color: var(--text-main);
}

.spec.hours.always-open {
  color: #22c55e;
  font-weight: 600;
}

.connectors-row {
  display: flex;
  gap: 6px;
}

.connector-tag {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1.5px solid;
  background: transparent;
}

.card-expanded {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--border-color);
}

.address {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.amenities {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.amenity {
  background: var(--primary-subtle, rgba(0, 0, 0, 0.05));
  color: var(--text-muted);
  font-size: 0.72rem;
  padding: 3px 8px;
  border-radius: 6px;
}

.nav-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  border: none;
  background: #22c55e;
  color: #fff;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  font-family: inherit;
}

.empty-feed {
  text-align: center;
  color: var(--text-muted);
  padding: 32px;
}

.map-section {
  flex: 1;
  position: relative;
}

#charging-map {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 24px;
  left: 24px;
  z-index: 500;
  padding: 14px 18px;
  border-radius: 12px;
  min-width: 160px;
}

.map-legend h4 {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-main);
  margin-bottom: 6px;
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .charging-container {
    flex-direction: column-reverse;
  }
  .sidebar {
    width: 100%;
    min-width: auto;
    height: 55vh;
  }
  .map-section {
    height: 45vh;
    flex: none;
  }
  .map-legend {
    bottom: 12px;
    left: 12px;
    padding: 10px 14px;
  }
}
</style>

<style>
/* EV map markers — PlugShare-inspired pins */
.ev-charging-marker {
  background: transparent !important;
  border: none !important;
}

.ev-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.2s ease;
  cursor: pointer;
}

.ev-marker-pin {
  width: 40px;
  height: 40px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: var(--marker-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  border: 2.5px solid #fff;
}

.ev-marker-icon,
.ev-marker-kw {
  transform: rotate(45deg);
  color: #fff;
  font-weight: 800;
  line-height: 1;
}

.ev-marker-icon {
  font-size: 0.55rem;
  margin-bottom: 1px;
}

.ev-marker-kw {
  font-size: 0.6rem;
}

.ev-marker-tail {
  width: 0;
  height: 0;
}

.ev-marker.selected .ev-marker-pin,
.ev-marker.hovered .ev-marker-pin {
  transform: rotate(-45deg) scale(1.2);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.45);
  z-index: 1000;
}

.ev-marker.selected,
.ev-marker.hovered {
  transform: translateY(-4px);
  z-index: 1000 !important;
}

.ev-popup {
  font-family: 'Outfit', sans-serif;
  line-height: 1.5;
}
</style>
