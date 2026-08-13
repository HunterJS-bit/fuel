<template>
  <div class="landing-layout">
    <slot />
  </div>
</template>

<style scoped>
.landing-layout {
  min-height: 100vh;
  background: var(--bg-color);
  color: var(--text-main);
}
</style>
