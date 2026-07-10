<template>
  <div class="prices-container">
    <div class="header-section">
      <h2>Price History & Trends</h2>
      <p>Analyze the market for A95, Diesel, and LPG</p>
    </div>

    <!-- Active Prices Section -->
    <div class="suppliers-grid">
      <div v-for="supplier in activePrices" :key="supplier.name" class="supplier-card glass-panel">
        <div class="supplier-info">
          <span class="supplier-name">{{ supplier.name }}</span>
        </div>
        <div class="supplier-price">
          <span class="price-value">{{ supplier.price }}</span>
          <span class="currency">RSD/L</span>
        </div>
      </div>
    </div>

    <!-- Graph Section -->
    <div class="graph-section glass-panel">
      <h3>Price Trends (2026)</h3>
      <div class="chart-container">
        <ClientOnly>
          <Line :data="chartData" :options="chartOptions" />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const activePrices = ref([
  { name: 'NIS Petrol', price: 195.0 },
  { name: 'OMV', price: 198.5 },
  { name: 'Eco', price: 194.0 },
  { name: 'MOL', price: 196.5 },
  { name: 'Lukoil', price: 197.0 }
])

// Dummy data for fuel prices over the months
const chartData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Avg Diesel Price',
      backgroundColor: '#00e676',
      borderColor: '#00e676',
      data: [192, 193, 191, 194, 195, 194.5, 195.5, 196, 195.5, 197, 198, 196.5],
      tension: 0.4
    }
  ]
})

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#ffffff'
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: '#b0bec5'
      },
      grid: {
        color: 'rgba(255,255,255,0.1)'
      }
    },
    y: {
      ticks: {
        color: '#b0bec5'
      },
      grid: {
        color: 'rgba(255,255,255,0.1)'
      }
    }
  }
})
</script>

<style scoped>
.prices-container {
  padding: 90px 20px 20px;
  min-height: 100vh;
  background: var(--bg-color);
  color: white;
  z-index: 2;
  position: relative;
}

.header-section {
  margin-bottom: 25px;
}
.header-section h2 {
  font-size: 2rem;
  color: var(--primary);
  text-shadow: 0 0 10px var(--primary-glow);
}
.header-section p {
  color: var(--text-muted);
}

.suppliers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 30px;
}
.supplier-card {
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.supplier-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 1.1rem;
}
.supplier-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.price-value {
  font-size: 1.5rem;
  color: var(--primary);
  font-weight: 700;
}
.currency {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.graph-section {
  padding: 20px;
}
.graph-section h3 {
  margin-bottom: 15px;
  font-size: 1.2rem;
  color: var(--text-main);
}
.chart-container {
  height: 250px;
  width: 100%;
}
</style>
