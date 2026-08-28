<template>
  <div class="error-page">
    <div class="error-content">
      <h1 class="error-code">404</h1>
      <h2>{{ $t('error.title') }}</h2>
      <p class="error-message subtitle-animate">{{ $t('error.message') }}</p>
      <div class="error-actions">
        <NuxtLink to="/" class="btn-primary">{{ $t('error.goHome') }}</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })
</script>

<style scoped>
.error-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
}
.error-content {
  text-align: center;
  max-width: 600px;
}
.error-code {
  font-size: clamp(6rem, 15vw, 10rem);
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 20px;
}
.error-content h2 {
  font-size: 2rem;
  margin-bottom: 16px;
}
.error-message {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 32px;
  line-height: 1.6;
}
.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.btn-primary {
  background: var(--fuel-gradient);
  color: var(--on-primary);
  padding: 14px 28px;
  border-radius: 10px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow: 0 8px 28px var(--primary-glow);
}
.btn-outline {
  border: 2px solid var(--primary);
  color: var(--primary);
  padding: 12px 28px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: var(--primary-subtle);
}
</style>
