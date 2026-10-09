<template>
  <div class="catchall-container">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <NuxtLink to="/">Go back home</NuxtLink>
  </div>
</template>

<script setup>
// Catch-all route to resolve Vue Router warnings for unmatched paths like DevTools
</script>

<style scoped>
.catchall-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}
</style>
