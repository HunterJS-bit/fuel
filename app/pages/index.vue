<template>
  <div class="map-container">
    <ClientOnly>
      <div id="map" class="map-view"></div>
    </ClientOnly>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const stations = [
  { id: 1, name: 'NIS Petrol', lat: 44.787197, lng: 20.457273, price: 195.0, type: 'NIS' },
  { id: 2, name: 'OMV', lat: 44.802197, lng: 20.470273, price: 198.5, type: 'OMV' },
  { id: 3, name: 'Eco', lat: 44.795197, lng: 20.445273, price: 194.0, type: 'Eco' },
  { id: 4, name: 'MOL', lat: 44.790197, lng: 20.485273, price: 196.5, type: 'MOL' }
]

onMounted(async () => {
  if (process.client) {
    const L = await import('leaflet')
    
    // Fix leaflet marker icon issue in Nuxt
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map('map', {
      zoomControl: false
    }).setView([44.793, 20.465], 13) // Belgrade center

    // Dark-themed tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map)

    stations.forEach(station => {
      // Create a custom icon showing the price
      const priceIcon = L.divIcon({
        className: 'custom-price-marker',
        html: `<div class="price-marker-content ${station.price <= 195 ? 'cheap' : ''}">
                 <span>${station.price}</span>
               </div>`,
        iconSize: [45, 30],
        iconAnchor: [22, 30]
      })

      L.marker([station.lat, station.lng], { icon: priceIcon })
        .addTo(map)
        .bindPopup(`<b>${station.name}</b><br>Euro Diesel: ${station.price} RSD`)
    })
  }
})
</script>

<style>
.map-container {
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}
.map-view {
  height: 100%;
  width: 100%;
}
.custom-price-marker {
  display: flex;
  justify-content: center;
}
.price-marker-content {
  background: var(--panel-bg);
  color: var(--text-main);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 4px 8px;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 4px 10px rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.price-marker-content.cheap {
  border-color: var(--primary);
  background: rgba(0, 230, 118, 0.1);
  color: var(--primary);
}
</style>
