<template>
  <div class="legal-page">
    <section class="legal-hero">
      <div class="hero-inner">
        <h1>Privacy Policy</h1>
        <p class="hero-sub">Last updated: August 24, 2026</p>
      </div>
    </section>

    <section class="legal-content">
      <div class="content-inner">
        <h2>1. Information We Collect</h2>
        <p>When you use 1-2-3 Fuel, we may collect information regarding your location if you grant us permission, as well as anonymous usage data to improve our services and price algorithms.</p>
        
        <h2>2. How We Use Information</h2>
        <p>Your information is used solely to provide accurate fuel prices in your region and to improve our mapping services. We do not sell your personal data to third parties.</p>

        <h2>3. Crowdsourced Pricing</h2>
        <p>If you submit a price report, the data will be used to update our database and will be publicly visible to other users. No personally identifiable information will be tied to your submission unless explicitly provided.</p>
        
        <h2>4. Third-Party Services</h2>
        <p>We use third-party map providers (Leaflet, CartoDB). Please refer to their respective privacy policies to understand how they handle location data.</p>
        
        <h2>5. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at info@123fuel.rs.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })
useHead({ title: 'Privacy Policy | 1-2-3 Fuel' })
</script>

<style scoped>
.legal-page { min-height: 100vh; overflow-x: hidden; }
.legal-hero { padding: 80px 24px; background: var(--landing-hero-bg); text-align: center; }
.legal-hero h1 { font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; margin-bottom: 12px; }
.hero-sub { color: var(--text-muted); font-size: 1.1rem; }
.legal-content { padding: 60px 24px 80px; background: var(--bg-color); }
.content-inner { max-width: 800px; margin: 0 auto; color: var(--text-main); line-height: 1.6; }
.content-inner h2 { margin-top: 32px; margin-bottom: 16px; font-size: 1.4rem; color: var(--primary); }
.content-inner p { margin-bottom: 16px; color: var(--text-muted); font-size: 1.05rem; }
</style>
