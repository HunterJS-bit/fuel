<template>
  <div style="height: 500px; width: 100%;">
    <l-map :zoom="13" :center="[51.505, -0.09]" :use-global-leaflet="false">
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" layer-type="base" name="OpenStreetMap"></l-tile-layer>

      <!-- Legend Control Box -->
      <l-control position="bottomright" class="map-legend">
        <h4>Map Legend</h4>
        <div v-for="item in legendItems" :key="item.label" class="legend-item">
          <i :style="{ backgroundColor: item.color }"></i>
          <span>{{ item.label }}</span>
        </div>
      </l-control>
    </l-map>
  </div>
</template>



<script setup>
import { ref } from 'vue';
import 'leaflet/dist/leaflet.css';

const legendItems = ref([
  { color: '#FF0000', label: 'High Danger' },
  { color: '#FFA500', label: 'Warning Zone' },
  { color: '#008000', label: 'Safe Area' }
]);
</script>

<style scoped>
.map-legend {
  background: white;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0,0,0,0.4);
}
.map-legend h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}
.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.legend-item i {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  opacity: 0.7;
  display: inline-block;
}
</style>