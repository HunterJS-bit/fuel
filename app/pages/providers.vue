<template>
  <div class="providers-page">
    <section class="providers-hero">
      <div class="hero-inner">
        <span class="section-badge">{{ $t('providers.badge') }}</span>
        <h1>{{ $t('providers.title') }}</h1>
        <p class="hero-sub subtitle-animate">{{ $t('providers.subtitle') }}</p>
      </div>
    </section>

    <!-- Provider Directory Table -->
    <section class="directory-section">
      <div class="section-inner">
        <div class="table-container">
          <table class="providers-table">
            <thead>
              <tr>
                <th>{{ $t('providers.table.company') }}</th>
                <th>{{ $t('providers.table.eurodiesel') }}</th>
                <th>{{ $t('providers.table.bmb95') }}</th>
                <th>{{ $t('providers.table.lpg') }}</th>
                <th>{{ $t('providers.table.bmb100') }}</th>
                <th>{{ $t('providers.table.stations') }}</th>
                <th>{{ $t('providers.table.action') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="provider in providersList" :key="provider.id" :class="{ 'best-price-row': provider.isLowest }">
                <td>
                  <div class="company-cell">
                    <div class="company-logo" :style="{ background: provider.color }">{{ provider.initials }}</div>
                    <div class="company-name">
                      <strong>{{ provider.name }}</strong>
                      <span v-if="provider.isLowest" class="lowest-badge">{{ $t('providers.cheapestFor') }} {{ provider.lowestFor }}</span>
                    </div>
                  </div>
                </td>
                <td :class="{ 'cheapest-cell': provider.lowestFor === 'Euro Diesel' }">{{ provider.prices.eurodiesel.toFixed(1) }} <small>RSD</small></td>
                <td :class="{ 'cheapest-cell': provider.lowestFor === 'BMB 95' }">{{ provider.prices.bmb95.toFixed(1) }} <small>RSD</small></td>
                <td :class="{ 'cheapest-cell': provider.lowestFor === 'LPG' }">{{ provider.prices.lpg.toFixed(1) }} <small>RSD</small></td>
                <td>{{ provider.prices.bmb100.toFixed(1) }} <small>RSD</small></td>
                <td>{{ provider.stations }} <span class="stations-lbl">{{ $t('providers.stations') }}</span></td>
                <td>
                  <NuxtLink :to="`/nearby?provider=${provider.slug}`" class="view-btn">
                    {{ $t('providers.viewOnMap') }}
                  </NuxtLink>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Price History Graph -->
    <section class="chart-section">
      <div class="section-inner">
        <div class="chart-header">
          <h2>{{ $t('providers.historyTitle') }}</h2>
          <div class="chart-toggles">
            <button
              v-for="fuel in ['eurodiesel', 'bmb95', 'lpg']"
              :key="fuel"
              :class="['fuel-btn', { active: activeChartFuel === fuel }]"
              @click="activeChartFuel = fuel"
            >
              {{ $t(`fuelTypes.${fuel}`) }}
            </button>
          </div>
        </div>
        <div class="chart-container">
          <Line :data="chartData" :options="chartOptions" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })
import { ref, computed } from 'vue'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'vue-chartjs'
import { useI18n } from 'vue-i18n'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const { t } = useI18n()

// Data
const providersList = ref([
  { id: 1, name: 'NIS Petrol', slug: 'nis', initials: 'NIS', color: '#0066cc', stations: 312, isLowest: false, lowestFor: null, prices: { eurodiesel: 195.0, bmb95: 185.0, lpg: 88.0, bmb100: 198.0 } },
  { id: 2, name: 'OMV', slug: 'omv', initials: 'OMV', color: '#003da5', stations: 89, isLowest: false, lowestFor: null, prices: { eurodiesel: 198.5, bmb95: 187.5, lpg: 89.0, bmb100: 202.0 } },
  { id: 3, name: 'Eco', slug: 'eco', initials: 'ECO', color: '#2ecc71', stations: 45, isLowest: true, lowestFor: 'Euro Diesel', prices: { eurodiesel: 194.0, bmb95: 184.0, lpg: 86.0, bmb100: 195.0 } },
  { id: 4, name: 'MOL', slug: 'mol', initials: 'MOL', color: '#00843d', stations: 67, isLowest: false, lowestFor: null, prices: { eurodiesel: 196.5, bmb95: 186.0, lpg: 87.5, bmb100: 199.0 } },
  { id: 5, name: 'Lukoil', slug: 'lukoil', initials: 'LK', color: '#e30613', stations: 52, isLowest: false, lowestFor: null, prices: { eurodiesel: 197.0, bmb95: 186.5, lpg: 88.5, bmb100: 200.0 } },
  { id: 6, name: 'Petrol', slug: 'petrol', initials: 'PT', color: '#ff6600', stations: 38, isLowest: true, lowestFor: 'LPG', prices: { eurodiesel: 196.0, bmb95: 185.5, lpg: 85.5, bmb100: 198.5 } },
  { id: 7, name: 'Knez Petrol', slug: 'knez', initials: 'KP', color: '#ffb300', stations: 40, isLowest: true, lowestFor: 'BMB 95', prices: { eurodiesel: 194.5, bmb95: 183.5, lpg: 87.0, bmb100: 196.0 } },
  { id: 8, name: 'EKO', slug: 'eko', initials: 'EK', color: '#e5b80b', stations: 25, isLowest: false, lowestFor: null, prices: { eurodiesel: 195.5, bmb95: 184.5, lpg: 86.5, bmb100: 197.0 } }
])

const activeChartFuel = ref('eurodiesel')

// Generating some fake historical data for the chart based on the current prices.
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

const chartData = computed(() => {
  const datasets = providersList.value.map(provider => {
    const basePrice = provider.prices[activeChartFuel.value]
    
    // Generate some slightly random historical data that converges on the current price
    const data = months.map((month, i) => {
       const isLast = i === months.length - 1
       if (isLast) return basePrice
       const variance = (Math.random() - 0.5) * 8 // +/- 4 RSD
       return basePrice + variance + ((months.length - 1 - i) * 0.5) // slight downward historical trend
    })

    return {
      label: provider.name,
      data: data,
      borderColor: provider.color,
      backgroundColor: provider.color,
      tension: 0.3,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6
    }
  })

  return {
    labels: months,
    datasets
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#8b9bb4', // var(--text-muted) equivalent for canvas
        font: {
          family: "'Outfit', sans-serif"
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)',
      titleColor: '#fff',
      bodyColor: '#e2e8f0',
      padding: 12,
      cornerRadius: 8,
      displayColors: true
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#8b9bb4'
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
        drawBorder: false
      },
      ticks: {
        color: '#8b9bb4',
        callback: function(value) {
          return value + ' RSD';
        }
      }
    }
  }
}
</script>

<style scoped>
.providers-page {
  min-height: 100vh;
  padding-bottom: 80px;
}
.providers-hero {
  padding: 80px 24px 60px;
  background: var(--landing-hero-bg);
  text-align: center;
}
.hero-inner {
  max-width: 800px;
  margin: 0 auto;
}
.section-badge {
  display: inline-block;
  color: var(--primary);
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 16px;
  background: var(--primary-subtle);
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid var(--primary-border);
}
.providers-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 20px;
  color: var(--text-main);
  line-height: 1.1;
  font-weight: 800;
}
.hero-sub {
  color: var(--text-muted);
  font-size: 1.15rem;
  line-height: 1.6;
}

/* Table Section */
.directory-section {
  padding: 0 24px 60px;
}
.section-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.table-container {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow-x: auto;
  box-shadow: 0 10px 40px var(--shadow-color);
}
.providers-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}
.providers-table th {
  text-align: left;
  padding: 20px 24px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
  background: rgba(0,0,0,0.2);
}
.providers-table td {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-main);
  vertical-align: middle;
}
.providers-table tr:last-child td {
  border-bottom: none;
}
.providers-table tbody tr {
  transition: background 0.2s;
}
.providers-table tbody tr:hover {
  background: rgba(255,255,255,0.02);
}
.providers-table tbody tr.best-price-row {
  background: linear-gradient(90deg, var(--primary-subtle) 0%, transparent 50%);
}

.company-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}
.company-logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 0.85rem;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}
.company-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.company-name strong {
  font-size: 1.1rem;
}
.lowest-badge {
  font-size: 0.7rem;
  color: var(--primary);
  background: var(--primary-subtle);
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid var(--primary-border);
  display: inline-block;
  width: fit-content;
}

.providers-table td small {
  color: var(--text-muted);
  font-size: 0.8rem;
  margin-left: 2px;
}
.cheapest-cell {
  color: var(--primary) !important;
  font-weight: 700;
}
.stations-lbl {
  color: var(--text-muted);
  font-size: 0.85rem;
}
.view-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;
}
.view-btn:hover {
  background: var(--fuel-gradient);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 2px 12px var(--primary-glow);
}

/* Chart */
.chart-section {
  padding: 40px 24px;
}
.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}
.chart-header h2 {
  font-size: 1.5rem;
}
.chart-toggles {
  display: flex;
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 4px;
}
.fuel-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s;
}
.fuel-btn:hover {
  color: var(--text-main);
}
.fuel-btn.active {
  background: var(--fuel-gradient);
  color: #fff;
  box-shadow: 0 2px 10px var(--primary-glow);
}
.chart-container {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  height: 400px;
  position: relative;
  box-shadow: 0 10px 40px var(--shadow-color);
}

@media (max-width: 900px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
