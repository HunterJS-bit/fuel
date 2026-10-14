<template>
  <div class="legal-page">
    <section class="legal-hero">
      <div class="hero-inner">
        <h1>Terms of Service</h1>
        <p class="hero-sub subtitle-animate">Last updated: August 24, 2026</p>
      </div>
    </section>

    <section class="legal-content">
      <div class="content-inner">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and using 1-2-3 Fuel ("we", "our", or "us"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our application.</p>
        
        <h2>2. Data Accuracy</h2>
        <p>While we strive to provide the most accurate and up-to-date fuel prices in Serbia, we cannot guarantee the accuracy of every price listed. Prices are subject to change by the fuel stations without notice. You agree that we are not liable for any discrepancies between the prices shown and the actual prices at the stations.</p>

        <h2>3. User Contributions</h2>
        <p>Users may submit fuel prices through our platform. By doing so, you agree to submit only accurate and truthful information. We reserve the right to ban or remove users who intentionally submit false data.</p>
        
        <h2>4. Intellectual Property</h2>
        <p>The design, logos, and features of 1-2-3 Fuel are our exclusive property. The map tiles belong to CartoDB and are used under their terms.</p>
        
        <h2>5. Modifications</h2>
        <p>We reserve the right to modify these terms at any time. Your continued use of the service constitutes your acceptance of the updated terms.</p>

        <h2>6. Contact Us</h2>
        <p>If you have any questions about this Terms of Service, please contact us at info@123fuel.rs.</p>
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'landing' })
useHead({ title: 'Terms of Service | 1-2-3 Fuel' })
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
