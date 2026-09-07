<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h1 class="error-title">{{ error.statusCode }}</h1>
      <h2 class="error-message">{{ error.statusMessage || 'Something went wrong' }}</h2>
      <p class="error-description">
        {{ error.message || 'An unexpected error occurred. Please try again.' }}
      </p>
      <div class="error-actions">
        <button @click="handleError" class="btn-primary">
          Go Home
        </button>
        <button @click="reloadPage" class="btn-secondary">
          Reload Page
        </button>
      </div>
      <details v-if="isDev" class="error-details">
        <summary>Technical Details</summary>
        <pre>{{ error.stack || JSON.stringify(error, null, 2) }}</pre>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const isDev = process.dev

const handleError = () => {
  clearError({
    redirect: '/'
  })
}

const reloadPage = () => {
  window.location.reload()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color, #0f172a);
  padding: 24px;
}

.error-container {
  max-width: 500px;
  text-align: center;
  padding: 48px 32px;
  background: var(--panel-bg, #1e293b);
  border: 1px solid var(--border-color, #334155);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 24px;
}

.error-title {
  font-size: 5rem;
  font-weight: 800;
  color: var(--text-main, #fff);
  margin: 0 0 16px 0;
  line-height: 1;
}

.error-message {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-main, #fff);
  margin: 0 0 16px 0;
}

.error-description {
  color: var(--text-muted, #94a3b8);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.error-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Outfit', sans-serif;
}

.btn-primary {
  background: var(--fuel-gradient, linear-gradient(90deg, #ff6b35, #ff9f43));
  color: #fff;
  border: none;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 107, 53, 0.4);
}

.btn-secondary {
  background: transparent;
  color: var(--text-main, #fff);
  border: 2px solid var(--border-color, #334155);
}

.btn-secondary:hover {
  background: var(--border-color, #334155);
}

.error-details {
  margin-top: 32px;
  text-align: left;
  background: rgba(0, 0, 0, 0.2);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color, #334155);
}

.error-details summary {
  cursor: pointer;
  color: var(--text-muted, #94a3b8);
  font-weight: 600;
  margin-bottom: 8px;
}

.error-details pre {
  margin: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.85rem;
  color: var(--text-muted, #94a3b8);
}
</style>
