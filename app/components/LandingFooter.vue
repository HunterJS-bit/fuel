<template>
  <footer class="landing-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <span class="brand-name">1-2-3 <em>Fuel</em></span>
        <p>{{ $t('footer.brand') }}</p>
      </div>
      <div class="footer-links">
        <h4>{{ $t('footer.product') }}</h4>
        <NuxtLink to="/blog">{{ $t('footer.blog') }}</NuxtLink>
        <NuxtLink to="/nearby">{{ $t('footer.liveMap') }}</NuxtLink>
        <NuxtLink to="/charging">{{ $t('footer.evCharging') }}</NuxtLink>
      </div>
      <div class="footer-links">
        <h4>{{ $t('footer.companies') }}</h4>
        <a href="#">NIS Petrol</a>
        <a href="#">OMV</a>
        <a href="#">MOL</a>
        <a href="#">Lukoil</a>
      </div>
      <div class="footer-links">
        <h4>{{ $t('footer.support') }}</h4>
        <NuxtLink to="/faq">{{ $t('footer.faq') }}</NuxtLink>
        <a href="#">{{ $t('footer.reportPrice') }}</a>
        <NuxtLink to="/contact">{{ $t('footer.contact') }}</NuxtLink>
      </div>
    </div>
    <div class="footer-bottom">
      <span>{{ $t('footer.copyright') }}</span>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.landing-footer {
  background: var(--panel-bg);
  border-top: 1px solid var(--border-color);
  padding: 60px 24px 0;
}
.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 40px;
}
.footer-brand p {
  color: var(--text-muted);
  margin-top: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
}
.footer-links h4 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.footer-links a {
  display: block;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 10px;
  opacity: 0.8;
  transition: color 0.2s;
}
.footer-links a:hover { color: var(--primary); opacity: 1; }
.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding: 20px 24px;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .footer-inner { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .footer-inner { grid-template-columns: 1fr; }
}
</style>
