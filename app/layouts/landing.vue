<template>
  <div class="landing-layout">
    <LandingHeader :show-cta="showCta" />
    <main class="landing-main">
      <slot />
    </main>
    <LandingFooter />
  </div>
</template>

<script setup>
const props = defineProps({
  showCta: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped>
.landing-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  color: var(--text-main);
}
.landing-main {
  flex: 1;
}
</style>
