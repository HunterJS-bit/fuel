<template>
  <div class="nearby-container">
    <aside class="sidebar animate-slide-in-left">
      <div class="sidebar-header animate-fade-in-up">
        <div class="header-badge">
          <span class="badge-icon">⛽</span>
          {{ $t('nearby.badge') }}
        </div>
        <h1 class="page-title">{{ $t('nearby.title') }}</h1>
        <p class="subtitle subtitle-animate">{{ $t('nearby.subtitle') }}</p>
      </div>

      <!-- Origin / Directions -->
      <div class="directions-panel glass-panel animate-fade-in-up animate-delay-1">
        <label class="panel-label">{{ $t('nearby.yourLocation') }}</label>
        <div class="origin-row">
          <div class="search-container">
            <svg viewBox="0 0 24 24" width="18" height="18" class="search-icon" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 5.4 8 12 8 12s8-6.6 8-12a8 8 0 0 0-8-8z"/>
            </svg>
            <input
              v-model="originQuery"
              type="text"
              class="location-search"
              :placeholder="$t('nearby.originPlaceholder')"
              @keydown.enter="searchOrigin"
            />
          </div>
          <button class="icon-btn" :title="$t('nearby.useMyLocation')" @click="useMyLocation" :disabled="locating">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
          </button>
        </div>

        <div v-if="geocodeResults.length" class="geocode-suggestions">
          <button
            v-for="(result, i) in geocodeResults"
            :key="i"
            class="suggestion-item"
            @click="setOrigin(result)"
          >
            {{ result.displayName }}
          </button>
        </div>

        <div v-if="origin" class="origin-set">
          <span class="origin-dot"></span>
          <span class="origin-text">{{ originLabel }}</span>
          <button class="clear-origin" @click="clearOrigin">×</button>
        </div>

        <div class="route-options">
          <label class="toggle-row">
            <input v-model="showRouteOnMap" type="checkbox" />
            <span>{{ $t('nearby.showRoute') }}</span>
          </label>
          <button class="search-origin-btn" @click="searchOrigin" :disabled="geocoding">
            {{ geocoding ? '...' : $t('nearby.findAddress') }}
          </button>
        </div>

        <div v-if="routeInfo" class="route-info animate-fade-in">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
          <span>{{ routeInfo.distanceKm.toFixed(1) }} km · {{ Math.round(routeInfo.durationMin) }} min</span>
        </div>
      </div>

      <div class="stats-row animate-fade-in-up animate-delay-2">
        <div class="stat-chip">
          <span class="stat-value">{{ filteredStations.length }}</span>
          <span class="stat-label">{{ $t('nearby.stats.stations') }}</span>
        </div>
        <div class="stat-chip cheapest">
          <span class="stat-value">{{ cheapestPrice.toFixed(0) }}</span>
          <span class="stat-label">{{ $t('nearby.stats.cheapest') }}</span>
        </div>
        <div class="stat-chip">
          <span class="stat-value">{{ avgPrice.toFixed(0) }}</span>
          <span class="stat-label">{{ $t('nearby.stats.average') }}</span>
        </div>
      </div>

      <div class="search-container animate-fade-in-up animate-delay-2">
        <svg viewBox="0 0 24 24" width="18" height="18" class="search-icon" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input v-model="searchQuery" type="text" class="location-search" :placeholder="$t('nearby.searchPlaceholder')" />
      </div>

      <div class="filter-chips animate-fade-in-up animate-delay-3">
        <button
          v-if="selectedProviderSlug"
          class="chip active"
          @click="$router.push({ query: { ...$route.query, provider: undefined } })"
        >
          {{ selectedProviderSlug.toUpperCase() }} &times;
        </button>
        <button
          v-for="filter in fuelFilters"
          :key="filter.key"
          class="chip"
          :class="{ active: fuelFilter === filter.key }"
          :style="filter.color ? { '--chip-color': filter.color } : {}"
          @click="fuelFilter = filter.key"
        >
          <span v-if="filter.color" class="chip-dot" :style="{ background: filter.color }"></span>
          {{ $t(filter.labelKey) }}
        </button>
      </div>

      <div class="stations-feed stagger-children">
        <TransitionGroup name="card-list">
          <div
            v-for="(station, idx) in paginatedStations"
            :key="station.id"
            class="station-card glass-panel hover-lift"
            :class="{
              selected: selectedStationId === station.id,
              'best-price': idx === 0 && sortBy === 'price'
            }"
            @click="selectStation(station)"
            @mouseenter="hoveredStationId = station.id"
            @mouseleave="hoveredStationId = null"
          >
            <div v-if="idx === 0 && sortBy === 'price'" class="best-badge">{{ $t('nearby.bestPrice') }}</div>

            <div class="card-top">
              <div
                class="tier-badge"
                :style="{
                  color: priceTierConfig[getStationTier(station)].color,
                  background: priceTierConfig[getStationTier(station)].bg
                }"
              >
                {{ $t(priceTierConfig[getStationTier(station)].labelKey) }}
              </div>
              <div v-if="station.distKm != null" class="distance">
                {{ station.distKm.toFixed(1) }} km
              </div>
            </div>

            <div class="card-body-row">
              <div class="brand-logo" :style="{ background: brandColors[getBrandKey(station.brand)] }">
                {{ station.brand?.charAt(0) || 'F' }}
              </div>
              <div class="card-info">
                <h3 class="s-name">{{ station.name }}</h3>
                <div class="s-meta">{{ station.brand }} · {{ station.city }}</div>
              </div>
              <div class="price-block">
                <span class="price-value">{{ (station.price || 0).toFixed(1) }}</span>
                <span class="price-unit">RSD</span>
              </div>
            </div>

            <div class="fuel-tags">
              <span v-for="f in station.fuels.slice(0, 3)" :key="f" class="fuel-tag">{{ f }}</span>
            </div>

            <div v-if="selectedStationId === station.id" class="card-expanded animate-fade-in">
              <p class="address">{{ station.address }}, {{ station.city }}</p>
              <p v-if="station.hours" class="hours" :class="{ open247: station.hours?.includes('00-24') }">
                {{ station.hours }}
              </p>
              <div class="card-actions">
                <button class="nav-btn primary" @click.stop="drawRouteTo(station)">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                  {{ $t('nearby.showRouteBtn') }}
                </button>
                <a
                  :href="directionsUrl(station)"
                  target="_blank"
                  rel="noopener"
                  class="nav-btn outline"
                  @click.stop
                >
                  {{ $t('nearby.openMaps') }}
                </a>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <button v-if="limit < filteredStations.length" class="load-more-btn" @click="limit += 20">
          {{ $t('nearby.loadMore') }}
        </button>
        <p v-if="stationsLoaded && filteredStations.length === 0" class="empty-feed">{{ $t('nearby.noResults') }}</p>
      </div>
    </aside>

    <div class="map-section">
      <div v-if="isMapLoading" class="map-loading-overlay">
        <div class="loader-ring"></div>
        <span>{{ $t('nearby.loadingMap') }}</span>
      </div>
      <ClientOnly>
        <div id="sticky-map"></div>
        <FuelMapLegend :route-active="routeLayerActive" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'landing' })

import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import { fetchStations } from '~/utils/fetchStations'
import {
  priceTierConfig,
  brandColors,
  getBrandKey,
  getPriceTier,
  buildFuelMarkerHtml,
  haversineKm
} from '~/utils/fuelMarkers'
import {
  geocodeAddress,
  fetchRoute,
  getGoogleMapsDirectionsUrl,
  getCurrentPosition
} from '~/utils/geocoding'
import {
  stationHasFuel,
  enrichStation,
  selectStationsForViewport,
  type FuelFilter
} from '~/utils/mapStations'
import type { Station } from '~/utils/fetchStations'

const { t } = useI18n()
const route = useRoute()

const searchQuery = ref('')
const fuelFilter = ref<FuelFilter>('all')
const selectedProviderSlug = computed(() => route.query.provider ? String(route.query.provider).toLowerCase() : '')
const stations = ref<Station[]>([])
const selectedStationId = ref<string | null>(null)
const hoveredStationId = ref<string | null>(null)
const isMapLoading = ref(true)
const stationsLoaded = ref(false)
const limit = ref(20)

const originQuery = ref('')
const origin = ref<{ lat: number; lon: number } | null>(null)
const originLabel = ref('')
const geocodeResults = ref([])
const geocoding = ref(false)
const locating = ref(false)
const showRouteOnMap = ref(true)
const routeInfo = ref<{ distanceKm: number; durationMin: number } | null>(null)
const routeLayerActive = ref(false)
const sortBy = ref<'price' | 'distance'>('price')

let leafletMap: any = null
let markerClusterGroup: any = null
let routeLayer: any = null
let originMarker: any = null
let mutationObserver: MutationObserver | null = null
const markerRefs: Record<string, any> = {}
let updateMarkersTimeout: ReturnType<typeof setTimeout> | null = null

const fuelFilters = [
  { key: 'all', labelKey: 'nearby.filters.all', color: null },
  { key: 'eurodiesel', labelKey: 'nearby.filters.diesel', color: '#16a34a' },
  { key: 'bmb95', labelKey: 'nearby.filters.petrol', color: '#f59e0b' },
  { key: 'lpg', labelKey: 'nearby.filters.lpg', color: '#8b5cf6' }
]

const enrichedStations = computed(() =>
  stations.value
    .filter((s) => stationHasFuel(s, fuelFilter.value))
    .map((s) => enrichStation(s, fuelFilter.value))
)

const filteredStations = computed(() => {
  let result = enrichedStations.value

  if (selectedProviderSlug.value) {
    result = result.filter((s) => s.brand?.toLowerCase().includes(selectedProviderSlug.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (s) =>
        s.city?.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q) ||
        s.name?.toLowerCase().includes(q) ||
        s.brand?.toLowerCase().includes(q)
    )
  }

  if (origin.value) {
    result = result.map((s) => ({
      ...s,
      distKm: haversineKm(origin.value!.lat, origin.value!.lon, s.latitude, s.longitude)
    }))
    if (sortBy.value === 'distance') {
      result.sort((a, b) => (a.distKm ?? 0) - (b.distKm ?? 0))
    } else {
      result.sort((a, b) => (a.price || 0) - (b.price || 0))
    }
  } else {
    result.sort((a, b) => (a.price || 0) - (b.price || 0))
  }

  return result
})

const paginatedStations = computed(() => filteredStations.value.slice(0, limit.value))

const priceRange = computed(() => {
  const prices = filteredStations.value.map((s) => s.price || 0)
  return {
    min: Math.min(...prices, 0),
    max: Math.max(...prices, 0)
  }
})

const cheapestPrice = computed(() => priceRange.value.min || 0)
const avgPrice = computed(() => {
  const p = filteredStations.value.map((s) => s.price || 0)
  return p.length ? p.reduce((a, b) => a + b, 0) / p.length : 0
})

const getStationTier = (station) =>
  getPriceTier(station.price || 0, priceRange.value.min, priceRange.value.max)

watch([searchQuery, fuelFilter], () => { limit.value = 20 })

watch(origin, (val) => {
  sortBy.value = val ? 'distance' : 'price'
  updateOriginMarker()
})

const searchOrigin = async () => {
  if (!originQuery.value.trim()) return
  geocoding.value = true
  try {
    geocodeResults.value = await geocodeAddress(originQuery.value)
    if (geocodeResults.value.length === 1) {
      setOrigin(geocodeResults.value[0])
    }
  } finally {
    geocoding.value = false
  }
}

const setOrigin = (result) => {
  origin.value = { lat: result.lat, lon: result.lon }
  originLabel.value = result.displayName.split(',').slice(0, 2).join(',')
  originQuery.value = originLabel.value
  geocodeResults.value = []
  if (leafletMap) {
    leafletMap.setView([result.lat, result.lon], 12, { animate: true })
  }
}

const clearOrigin = () => {
  origin.value = null
  originLabel.value = ''
  originQuery.value = ''
  geocodeResults.value = []
  clearRoute()
}

const useMyLocation = async () => {
  locating.value = true
  try {
    const pos = await getCurrentPosition()
    origin.value = pos
    originLabel.value = t('nearby.myLocation')
    originQuery.value = originLabel.value
    geocodeResults.value = []
    if (leafletMap) {
      leafletMap.setView([pos.lat, pos.lon], 13, { animate: true })
    }
  } catch {
    alert(t('nearby.locationError'))
  } finally {
    locating.value = false
  }
}

const directionsUrl = (station) => {
  if (origin.value) {
    return getGoogleMapsDirectionsUrl(
      origin.value.lat,
      origin.value.lon,
      station.latitude,
      station.longitude
    )
  }
  return `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`
}

const selectStation = (station) => {
  selectedStationId.value = selectedStationId.value === station.id ? null : station.id
  if (leafletMap) {
    leafletMap.setView([station.latitude, station.longitude], 14, { animate: true })
  }
  if (selectedStationId.value && origin.value && showRouteOnMap.value) {
    drawRouteTo(station)
  }
}

const drawRouteTo = async (station) => {
  if (!origin.value || !leafletMap) {
    alert(t('nearby.setOriginFirst'))
    return
  }

  const L = window.L
  clearRoute()

  const route = await fetchRoute(
    origin.value.lat,
    origin.value.lon,
    station.latitude,
    station.longitude
  )

  if (!route) return

  routeInfo.value = route

  if (showRouteOnMap.value) {
    routeLayer = L.polyline(route.coordinates, {
      color: '#ff6b35',
      weight: 5,
      opacity: 0.85,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(leafletMap)

    routeLayerActive.value = true
    leafletMap.fitBounds(routeLayer.getBounds(), { padding: [60, 60], animate: true })
  }
}

const clearRoute = () => {
  if (routeLayer && leafletMap) {
    leafletMap.removeLayer(routeLayer)
    routeLayer = null
  }
  routeLayerActive.value = false
  routeInfo.value = null
}

const updateOriginMarker = async () => {
  if (!leafletMap || !window.L) return
  const L = window.L

  if (originMarker) {
    leafletMap.removeLayer(originMarker)
    originMarker = null
  }

  if (!origin.value) return

  const icon = L.divIcon({
    className: 'origin-marker-wrap',
    html: '<div class="origin-marker pulse"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })

  originMarker = L.marker([origin.value.lat, origin.value.lon], { icon, zIndexOffset: 1000 }).addTo(leafletMap)
}

const updateMapMarkers = () => {
  if (!leafletMap || !markerClusterGroup || !window.L) return
  const L = window.L

  markerClusterGroup.clearLayers()
  Object.keys(markerRefs).forEach((k) => delete markerRefs[k])

  const bounds = leafletMap.getBounds()
  const zoom = leafletMap.getZoom()
  const visible = selectStationsForViewport(filteredStations.value, bounds, zoom)
  const bestId = filteredStations.value[0]?.id

  visible.forEach((station) => {
    const tier = getStationTier(station)
    const isBest = station.id === bestId
    const isSelected = station.id === selectedStationId.value

    const icon = L.divIcon({
      className: 'fuel-charging-marker',
      html: buildFuelMarkerHtml(station.price || 0, tier, isBest, isSelected),
      iconSize: [48, 56],
      iconAnchor: [24, 56]
    })

    const allFuelsHtml = (station.fuels || []).map(f => `<span style="display:inline-block; margin-right:4px; padding:2px 6px; background:var(--panel-bg); border:1px solid var(--border-color); border-radius:4px; font-size:0.75rem">${f}</span>`).join('');
    const hoursHtml = station.hours ? `<div style="margin-top:6px; font-size:0.85rem; color:var(--success, #16a34a)">${station.hours.includes('00-24') ? '00-24 Open' : station.hours}</div>` : '';
    const dirUrl = directionsUrl(station);
    const popupContent = `
      <div class="fuel-popup" style="min-width: 180px; font-family: 'Outfit', sans-serif;">
        <h4 style="margin:0 0 4px 0; font-size:1.05rem; color:var(--text-main)">${station.name}</h4>
        <div style="font-size:0.85rem; color:var(--text-muted); margin-bottom:8px">${station.brand} · ${station.address}</div>
        <div style="margin-bottom:8px;">
          <strong>${(station.price || 0).toFixed(1)} RSD</strong>
        </div>
        <div style="margin-bottom:8px;">
          ${allFuelsHtml}
        </div>
        ${hoursHtml}
        <a href="${dirUrl}" target="_blank" style="display:inline-block; margin-top:10px; width:100%; text-align:center; padding:8px; background:var(--fuel-gradient); color:#fff; border-radius:6px; text-decoration:none; font-weight:600; font-size:0.85rem;">Directions</a>
      </div>
    `;

    const marker = L.marker([station.latitude, station.longitude], { icon })
      .bindPopup(popupContent)
      .on('click', () => {
        selectedStationId.value = station.id
      })

    markerClusterGroup.addLayer(marker)
    markerRefs[station.id] = marker
  })
}

const updateMarkerIcons = () => {
  if (!window.L) return
  const L = window.L
  const bestId = filteredStations.value[0]?.id

  Object.entries(markerRefs).forEach(([id, marker]) => {
    const station = filteredStations.value.find((s) => s.id === id)
    if (!station) return

    const tier = getStationTier(station)
    const isBest = station.id === bestId
    const isSelected = station.id === selectedStationId.value || station.id === hoveredStationId.value

    const html = buildFuelMarkerHtml(station.price || 0, tier, isBest, isSelected)

    // @ts-ignore
    marker.options.icon.options.html = html

    // @ts-ignore
    const el = marker.getElement()
    if (el) {
      const innerMarker = el.querySelector('.fuel-marker')
      if (innerMarker) {
        const extra = [isBest ? 'best' : '', isSelected ? 'selected' : ''].filter(Boolean).join(' ')
        innerMarker.className = `fuel-marker ${extra}`.trim()
        innerMarker.setAttribute('data-tier', tier)
      }
    }
  })
}

watch([filteredStations], () => {
  if (updateMarkersTimeout) clearTimeout(updateMarkersTimeout)
  updateMarkersTimeout = setTimeout(() => {
    updateMapMarkers()
  }, 200)
})

watch([selectedStationId, hoveredStationId], () => {
  updateMarkerIcons()
})

onMounted(async () => {
  if (!process.client) return

  stations.value = await fetchStations()
  stationsLoaded.value = true

  await nextTick()

  const L_mod = await import('leaflet')
  const L = L_mod.default || L_mod
  window.L = L
  await import('leaflet/dist/leaflet.css')
  await import('leaflet.markercluster')
  await import('leaflet.markercluster/dist/MarkerCluster.css')
  await import('leaflet.markercluster/dist/MarkerCluster.Default.css')

  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
  })

  const serbiaBounds = L.latLngBounds([41.8, 18.8], [46.2, 23.0])
  leafletMap = L.map('sticky-map', {
    zoomControl: true,
    maxBounds: serbiaBounds,
    maxBoundsViscosity: 1.0,
    minZoom: 6
  }).setView([44.0, 21.0], 7)

  const isLight = !document.documentElement.classList.contains('dark-mode')
  const tileLayer = L.tileLayer(
    isLight
      ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { attribution: '&copy; OpenStreetMap contributors', maxZoom: 20 }
  ).addTo(leafletMap)

  const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OSM',
    maxZoom: 19
  })

  L.control.layers(
    { [t('nearby.layers.default')]: tileLayer, [t('nearby.layers.street')]: streetLayer },
    {},
    { position: 'topright' }
  ).addTo(leafletMap)

  mutationObserver = new MutationObserver(() => {
    const dark = document.documentElement.classList.contains('dark-mode')
    tileLayer.setUrl(
      dark
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    )
  })
  mutationObserver.observe(document.documentElement, { attributes: true })

  markerClusterGroup = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: 45,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    iconCreateFunction: (cluster: any) => {
      const count = cluster.getChildCount()
      return L.divIcon({
        html: `<div class="cluster-icon" style="background: var(--fuel-accent, #ff6b35); color: #fff; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 3px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.2); font-weight: 700; font-size: 14px;">${count}</div>`,
        className: 'custom-cluster-icon',
        iconSize: L.point(36, 36)
      })
    }
  })
  leafletMap.addLayer(markerClusterGroup)

  leafletMap.on('moveend zoomend', () => {
    if (updateMarkersTimeout) clearTimeout(updateMarkersTimeout)
    updateMarkersTimeout = setTimeout(() => {
      updateMapMarkers()
    }, 300)
  })

  updateMapMarkers()
  setTimeout(() => { isMapLoading.value = false }, 400)
})

onUnmounted(() => {
  mutationObserver?.disconnect()
  clearRoute()
  if (updateMarkersTimeout) clearTimeout(updateMarkersTimeout)
})
</script>

<style scoped>
.nearby-container {
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
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  z-index: 2;
  border-right: 1px solid var(--border-color);
  background: var(--bg-color);
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--fuel-accent-subtle);
  color: var(--fuel-accent);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 700;
  margin-bottom: 10px;
  border: 1px solid var(--fuel-accent-border);
}

.badge-icon { font-size: 0.9rem; }

.page-title {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.92rem;
  margin-top: 6px;
}

.directions-panel {
  padding: 16px;
  border-radius: 16px;
}

.panel-label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.origin-row {
  display: flex;
  gap: 8px;
}

.search-container {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
  pointer-events: none;
}

.location-search {
  width: 100%;
  padding: 11px 12px 11px 38px;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.location-search:focus {
  border-color: var(--fuel-accent);
  box-shadow: 0 0 0 3px var(--fuel-accent-subtle);
}

.icon-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  background: var(--panel-bg);
  color: var(--fuel-accent);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.icon-btn:hover:not(:disabled) {
  background: var(--fuel-accent-subtle);
  border-color: var(--fuel-accent-border);
}

.icon-btn:disabled { opacity: 0.5; }

.geocode-suggestions {
  margin-top: 8px;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  overflow: hidden;
}

.suggestion-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: var(--panel-bg);
  border: none;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
  font-size: 0.82rem;
  cursor: pointer;
  font-family: inherit;
}

.suggestion-item:last-child { border-bottom: none; }
.suggestion-item:hover { background: var(--fuel-accent-subtle); }

.origin-set {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  background: var(--fuel-accent-subtle);
  border-radius: 10px;
  font-size: 0.82rem;
}

.origin-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--fuel-accent);
  flex-shrink: 0;
}

.origin-text {
  flex: 1;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clear-origin {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  line-height: 1;
}

.route-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
  gap: 10px;
}

.toggle-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-muted);
  cursor: pointer;
}

.toggle-row input { accent-color: var(--fuel-accent); }

.search-origin-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--fuel-accent-border);
  background: var(--fuel-accent-subtle);
  color: var(--fuel-accent);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 8px 12px;
  background: rgba(255, 107, 53, 0.1);
  border-radius: 8px;
  color: var(--fuel-accent);
  font-size: 0.85rem;
  font-weight: 600;
}

.stats-row {
  display: flex;
  gap: 8px;
}

.stat-chip {
  flex: 1;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 10px;
  text-align: center;
}

.stat-chip.cheapest {
  border-color: var(--fuel-accent-border);
  background: var(--fuel-accent-subtle);
}

.stat-value {
  display: block;
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-main);
}

.stat-chip.cheapest .stat-value { color: var(--fuel-accent); }

.stat-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
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
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.chip:hover {
  border-color: var(--chip-color, var(--fuel-accent));
}

.chip.active {
  background: var(--chip-color, var(--fuel-accent));
  border-color: var(--chip-color, var(--fuel-accent));
  color: #fff;
}

.chip-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.stations-feed {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 32px;
}

.station-card {
  position: relative;
  padding: 16px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: border-color 0.2s, transform 0.25s, box-shadow 0.25s;
}

.station-card.selected {
  border-left-color: var(--fuel-accent);
  box-shadow: 0 0 0 1px var(--fuel-accent-border);
}

.station-card.best-price {
  background: linear-gradient(135deg, var(--glass-bg), var(--fuel-accent-subtle));
}

.best-badge {
  position: absolute;
  top: -10px;
  right: 14px;
  background: var(--fuel-accent);
  color: #fff;
  padding: 3px 10px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.tier-badge {
  font-size: 0.68rem;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.distance {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--fuel-accent);
}

.card-body-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}

.card-info { flex: 1; min-width: 0; }

.s-name {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.s-meta {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.price-block { text-align: right; }

.price-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main);
  line-height: 1;
}

.price-unit {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 600;
}

.fuel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 10px;
}

.fuel-tag {
  font-size: 0.68rem;
  padding: 2px 7px;
  border-radius: 5px;
  background: var(--hover-bg);
  color: var(--text-muted);
  font-weight: 600;
}

.card-expanded {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}

.address, .hours {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 6px;
}

.hours.open247 { color: var(--success); font-weight: 600; }

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.nav-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  border: none;
  transition: all 0.2s;
}

.nav-btn.primary {
  background: var(--fuel-accent);
  color: #fff;
}

.nav-btn.primary:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.nav-btn.outline {
  background: transparent;
  border: 1.5px solid var(--border-color);
  color: var(--text-main);
}

.load-more-btn {
  padding: 12px;
  border-radius: 12px;
  border: 1px dashed var(--border-color);
  background: transparent;
  color: var(--fuel-accent);
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
}

.empty-feed {
  text-align: center;
  color: var(--text-muted);
  padding: 24px;
}

.map-section {
  flex: 1;
  position: relative;
}

#sticky-map {
  width: 100%;
  height: 100%;
}

.map-loading-overlay {
  position: absolute;
  inset: 0;
  background: var(--bg-color);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--text-muted);
  font-size: 0.9rem;
}

.loader-ring {
  width: 44px;
  height: 44px;
  border: 3px solid var(--border-color);
  border-top-color: var(--fuel-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}

.card-list-leave-to {
  opacity: 0;
  transform: translateX(12px);
}

@media (max-width: 900px) {
  .nearby-container { flex-direction: column-reverse; }
  .sidebar { width: 100%; min-width: auto; height: 55vh; }
  .map-section { height: 45vh; flex: none; }
}
</style>

<style>
.fuel-charging-marker,
.origin-marker-wrap {
  background: transparent !important;
  border: none !important;
}

.fuel-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  animation: marker-drop 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.fuel-marker-pin {
  width: 42px;
  height: 42px;
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

.fuel-marker-price,
.fuel-marker-unit {
  transform: rotate(45deg);
  color: #fff;
  font-weight: 800;
  line-height: 1;
}

.fuel-marker-price { font-size: 0.65rem; }
.fuel-marker-unit { font-size: 0.45rem; opacity: 0.85; }

.fuel-marker.best .fuel-marker-pin {
  box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.5), 0 4px 14px rgba(0, 0, 0, 0.35);
}

.fuel-marker.selected,
.fuel-marker.hovered {
  transform: translateY(-6px) scale(1.1);
  z-index: 1000 !important;
}

.origin-marker {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #ff6b35;
  border: 3px solid #fff;
  box-shadow: 0 2px 10px rgba(255, 107, 53, 0.6);
}

.origin-marker.pulse {
  animation: pulse-glow 2s ease infinite;
}

.fuel-popup {
  font-family: 'Outfit', sans-serif;
  line-height: 1.5;
}

@keyframes marker-drop {
  0% { opacity: 0; transform: translateY(-16px) scale(0.7); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 53, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(255, 107, 53, 0); }
}
</style>
