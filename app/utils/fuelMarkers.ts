export type PriceTier = 'low' | 'medium' | 'high'

export interface PriceTierConfig {
  color: string
  bg: string
  labelKey: string
}

export const priceTierConfig: Record<PriceTier, PriceTierConfig> = {
  low: {
    color: '#16a34a',
    bg: 'rgba(22, 163, 74, 0.15)',
    labelKey: 'nearby.legend.low'
  },
  medium: {
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
    labelKey: 'nearby.legend.medium'
  },
  high: {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    labelKey: 'nearby.legend.high'
  }
}

export const brandColors: Record<string, string> = {
  nis: '#004d96',
  omv: '#007646',
  mol: '#e3000f',
  eco: '#e31837',
  lukoil: '#d40511',
  gazprom: '#0070ba',
  default: '#64748b'
}

export function getBrandKey(brand: string): string {
  const b = brand.toLowerCase()
  if (b.includes('nis')) return 'nis'
  if (b.includes('omv')) return 'omv'
  if (b.includes('mol')) return 'mol'
  if (b.includes('eco')) return 'eco'
  if (b.includes('lukoil')) return 'lukoil'
  if (b.includes('gazprom')) return 'gazprom'
  return 'default'
}

export function getPriceTier(price: number, min: number, max: number): PriceTier {
  if (max === min) return 'medium'
  const ratio = (price - min) / (max - min)
  if (ratio <= 0.33) return 'low'
  if (ratio <= 0.66) return 'medium'
  return 'high'
}

export function buildFuelMarkerHtml(
  price: number,
  tier: PriceTier,
  isBest = false,
  isSelected = false
): string {
  const cfg = priceTierConfig[tier]
  const extra = [isBest ? 'best' : '', isSelected ? 'selected' : ''].filter(Boolean).join(' ')
  return `<div class="fuel-marker ${extra}" style="--marker-color:${cfg.color}" data-tier="${tier}">
    <div class="fuel-marker-pin">
      <span class="fuel-marker-price">${price.toFixed(0)}</span>
      <span class="fuel-marker-unit">RSD</span>
    </div>
    <div class="fuel-marker-tail"></div>
  </div>`
}

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
