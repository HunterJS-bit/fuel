export type ChargerType = 'type2' | 'ccs' | 'chademo' | 'tesla' | 'ultra'

export interface ChargingStation {
  id: string
  name: string
  network: string
  address: string
  city: string
  latitude: number
  longitude: number
  connectors: ChargerType[]
  primaryType: ChargerType
  powerKw: number
  stalls: number
  available: number
  pricePerKwh: number
  hours: string
  amenities: string[]
}

export const chargerConfig: Record<ChargerType, { color: string; bg: string; labelKey: string; icon: string }> = {
  type2: {
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.15)',
    labelKey: 'charging.types.type2',
    icon: 'AC'
  },
  ccs: {
    color: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.15)',
    labelKey: 'charging.types.ccs',
    icon: 'DC'
  },
  chademo: {
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
    labelKey: 'charging.types.chademo',
    icon: 'CHA'
  },
  tesla: {
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
    labelKey: 'charging.types.tesla',
    icon: '⚡'
  },
  ultra: {
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.15)',
    labelKey: 'charging.types.ultra',
    icon: 'HPC'
  }
}

export function getAvailabilityStatus(available: number, stalls: number): 'available' | 'busy' | 'offline' {
  if (available === 0) return stalls > 0 ? 'busy' : 'offline'
  if (available < stalls) return 'busy'
  return 'available'
}

export function buildMarkerHtml(station: ChargingStation, isSelected = false): string {
  const cfg = chargerConfig[station.primaryType]
  const selected = isSelected ? ' selected' : ''
  return `<div class="ev-marker${selected}" style="--marker-color:${cfg.color}" id="ev-marker-${station.id}">
    <div class="ev-marker-pin">
      <span class="ev-marker-icon">${cfg.icon}</span>
      <span class="ev-marker-kw">${station.powerKw}</span>
    </div>
    <div class="ev-marker-tail"></div>
  </div>`
}
