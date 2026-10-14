<template>
  <div class="fuel-map-legend glass-panel animate-fade-in">
    <h4>{{ $t('nearby.legend.title') }}</h4>
    <div v-for="(cfg, tier) in tiers" :key="tier" class="legend-item">
      <span class="legend-pin" :style="{ background: cfg.color }"></span>
      <span>{{ $t(cfg.labelKey) }}</span>
    </div>
    <div v-if="showRouteHint && routeActive" class="legend-route">
      <span class="legend-line"></span>
      <span>{{ $t('nearby.legend.route') }}</span>
    </div>
  </div>
</template>

<script setup>
import { priceTierConfig } from '~/utils/fuelMarkers'

defineProps({
  showRouteHint: { type: Boolean, default: true },
  routeActive: { type: Boolean, default: false }
})

const tiers = priceTierConfig
</script>

<style scoped>
.fuel-map-legend {
  position: absolute;
  bottom: 24px;
  left: 24px;
  z-index: 500;
  padding: 14px 18px;
  border-radius: 14px;
  min-width: 170px;
}

.fuel-map-legend h4 {
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
  margin-bottom: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  color: var(--text-main);
  margin-bottom: 7px;
}

.legend-pin {
  width: 12px;
  height: 12px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  flex-shrink: 0;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.legend-route {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.82rem;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border-color);
  color: var(--text-main);
}

.legend-line {
  width: 24px;
  height: 3px;
  background: var(--fuel-accent, #ff6b35);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
}

@media (max-width: 900px) {
  .fuel-map-legend {
    bottom: 12px;
    left: 12px;
    padding: 10px 14px;
  }
}
</style>
