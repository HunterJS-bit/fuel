<template>
  <div class="contact-page">
    <!-- Hero Section -->
    <section class="contact-hero">
      <div class="hero-inner">
        <span class="hero-badge">{{ $t('contact.badge') }}</span>
        <h1>{{ $t('contact.title') }}</h1>
        <p class="hero-sub">{{ $t('contact.subtitle') }}</p>
      </div>
    </section>

    <!-- Contact Content -->
    <section class="contact-content">
      <div class="content-inner">
        <div class="contact-grid">
          <!-- Contact Form -->
          <div class="contact-form-section">
            <h2>{{ $t('contact.formTitle') }}</h2>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>{{ $t('contact.name') }}</label>
                <input 
                  v-model="formData.name" 
                  type="text" 
                  :placeholder="$t('contact.namePlaceholder')"
                  required
                />
              </div>
              <div class="form-group">
                <label>{{ $t('contact.email') }}</label>
                <input 
                  v-model="formData.email" 
                  type="email" 
                  :placeholder="$t('contact.emailPlaceholder')"
                  required
                />
              </div>
              <div class="form-group">
                <label>{{ $t('contact.subject') }}</label>
                <select v-model="formData.subject" required>
                  <option value="">{{ $t('contact.selectSubject') }}</option>
                  <option value="support">{{ $t('contact.subjects.support') }}</option>
                  <option value="report">{{ $t('contact.subjects.report') }}</option>
                  <option value="feedback">{{ $t('contact.subjects.feedback') }}</option>
                  <option value="partnership">{{ $t('contact.subjects.partnership') }}</option>
                  <option value="other">{{ $t('contact.subjects.other') }}</option>
                </select>
              </div>
              <div class="form-group">
                <label>{{ $t('contact.message') }}</label>
                <textarea 
                  v-model="formData.message" 
                  rows="6" 
                  :placeholder="$t('contact.messagePlaceholder')"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn-submit">
                {{ $t('contact.submit') }}
                <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></svg>
              </button>
            </form>
            <div v-if="submitted" class="success-message">
              {{ $t('contact.success') }}
            </div>
          </div>

          <!-- Contact Info -->
          <div class="contact-info-section">
            <h2>{{ $t('contact.infoTitle') }}</h2>
            
            <div class="contact-cards">
              <div class="contact-card">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                </div>
                <h3>{{ $t('contact.emailTitle') }}</h3>
                <a href="mailto:info@123fuel.rs" class="contact-link">info@123fuel.rs</a>
                <p class="contact-desc">{{ $t('contact.emailDesc') }}</p>
              </div>

              <div class="contact-card">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill="currentColor"/></svg>
                </div>
                <h3>{{ $t('contact.phoneTitle') }}</h3>
                <a href="tel:+381112345678" class="contact-link">+381 11 234 5678</a>
                <p class="contact-desc">{{ $t('contact.phoneDesc') }}</p>
              </div>

              <div class="contact-card">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg>
                </div>
                <h3>{{ $t('contact.locationTitle') }}</h3>
                <p class="contact-text">Belgrade, Serbia</p>
                <p class="contact-desc">{{ $t('contact.locationDesc') }}</p>
              </div>

              <div class="contact-card">
                <div class="card-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" fill="currentColor"/></svg>
                </div>
                <h3>{{ $t('contact.webTitle') }}</h3>
                <a href="https://123fuel.rs" class="contact-link">123fuel.rs</a>
                <p class="contact-desc">{{ $t('contact.webDesc') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
definePageMeta({ 
  layout: 'landing'
})

import { ref } from 'vue'

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitted = ref(false)

const handleSubmit = () => {
  // Handle form submission here
  console.log('Form submitted:', formData.value)
  submitted.value = true
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: ''
  }
  setTimeout(() => {
    submitted.value = false
  }, 5000)
}

</script>

<style scoped>
.contact-page {
  overflow-x: hidden;
}

/* ── Hero ── */
.contact-hero {
  padding: 80px 24px 60px;
  background: var(--landing-hero-bg);
  text-align: center;
}
.hero-inner {
  max-width: 800px;
  margin: 0 auto;
}
.hero-badge {
  display: inline-block;
  background: var(--primary-subtle);
  color: var(--primary);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 20px;
  border: 1px solid var(--primary-border);
}
.contact-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
}
.hero-sub {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.6;
}

/* ── Contact Content ── */
.contact-content {
  padding: 60px 24px;
  background: var(--bg-color);
}
.content-inner {
  max-width: 1200px;
  margin: 0 auto;
}
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

/* ── Contact Form ── */
.contact-form-section h2,
.contact-info-section h2 {
  font-size: 1.8rem;
  margin-bottom: 32px;
}
.contact-form {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 32px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 8px;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 12px 14px;
  border-radius: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary);
}
.form-group textarea {
  resize: vertical;
}
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  background: var(--primary);
  color: var(--on-primary);
  padding: 14px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px var(--primary-glow);
}
.success-message {
  margin-top: 20px;
  padding: 16px;
  background: var(--success);
  color: white;
  border-radius: 10px;
  text-align: center;
  font-weight: 600;
}

/* ── Contact Info ── */
.contact-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}
.contact-card {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.2s;
}
.contact-card:hover {
  border-color: var(--primary-border);
}
.card-icon {
  width: 48px;
  height: 48px;
  background: var(--primary-subtle);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 16px;
}
.contact-card h3 {
  font-size: 1.1rem;
  margin-bottom: 8px;
}
.contact-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  display: block;
  margin-bottom: 8px;
}
.contact-link:hover {
  text-decoration: underline;
}
.contact-text {
  color: var(--text-main);
  font-weight: 500;
  margin-bottom: 8px;
}
.contact-desc {
  color: var(--text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .contact-grid { grid-template-columns: 1fr; }
  .contact-cards { grid-template-columns: 1fr; }
}
@media (max-width: 600px) {
  .contact-cards { grid-template-columns: 1fr; }
}
</style>
