<template>
  <div class="report-page">
    <section class="report-hero">
      <div class="hero-inner">
        <span class="hero-badge">Help Us Out</span>
        <h1>Report a Price</h1>
        <p class="hero-sub subtitle-animate">Help the community by sharing the latest fuel prices at your local station.</p>
      </div>
    </section>

    <section class="report-content">
      <div class="content-inner">
        <div class="report-form-section">
          <form class="report-form" @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Station Brand / Name</label>
              <select v-model="formData.brand" required>
                <option value="">Select a brand...</option>
                <option value="NIS Petrol">NIS Petrol</option>
                <option value="OMV">OMV</option>
                <option value="MOL">MOL</option>
                <option value="Lukoil">Lukoil</option>
                <option value="Eco">Eco</option>
                <option value="Petrol">Petrol</option>
                <option value="Other">Other (specify in notes)</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>City / Address</label>
              <input 
                v-model="formData.location" 
                type="text" 
                placeholder="e.g. Belgrade, Jurija Gagarina 23"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group flex-1">
                <label>Fuel Type</label>
                <select v-model="formData.fuelType" required>
                  <option value="">Select fuel type...</option>
                  <option value="Euro Diesel">Euro Diesel</option>
                  <option value="BMB 95">BMB 95</option>
                  <option value="BMB 100">BMB 100</option>
                  <option value="TNG/LPG">TNG / LPG</option>
                </select>
              </div>
              <div class="form-group flex-1">
                <label>Price (RSD)</label>
                <input 
                  v-model.number="formData.price" 
                  type="number" 
                  step="0.1" 
                  placeholder="e.g. 195.5"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label>Additional Notes (Optional)</label>
              <textarea 
                v-model="formData.notes" 
                rows="3" 
                placeholder="Any other details..."
              ></textarea>
            </div>

            <button type="submit" class="btn-submit">
              Submit Report
              <svg viewBox="0 0 24 24" width="18" height="18"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" fill="currentColor"/></svg>
            </button>
          </form>
          
          <div v-if="submitted" class="success-message">
            Thank you! Your price report has been submitted successfully and is pending review.
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
  brand: '',
  location: '',
  fuelType: '',
  price: '',
  notes: ''
})

const submitted = ref(false)

const handleSubmit = () => {
  console.log('Price Reported:', formData.value)
  submitted.value = true
  formData.value = {
    brand: '',
    location: '',
    fuelType: '',
    price: '',
    notes: ''
  }
  setTimeout(() => {
    submitted.value = false
  }, 5000)
}
</script>

<style scoped>
.report-page {
  overflow-x: hidden;
  min-height: 100vh;
}

.report-hero {
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
.report-hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  margin-bottom: 16px;
}
.hero-sub {
  color: var(--text-muted);
  font-size: 1.1rem;
  line-height: 1.6;
}

.report-content {
  padding: 60px 24px 80px;
  background: var(--bg-color);
}
.content-inner {
  max-width: 600px;
  margin: 0 auto;
}

.report-form-section {
  background: var(--panel-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 40px var(--shadow-color);
}
.form-group {
  margin-bottom: 20px;
}
.form-row {
  display: flex;
  gap: 20px;
}
.flex-1 {
  flex: 1;
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
  padding: 14px;
  border-radius: 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-subtle);
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
  background: var(--fuel-gradient);
  color: var(--on-primary, #fff);
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  margin-top: 10px;
  box-shadow: 0 4px 20px var(--primary-glow);
}
.btn-submit:hover {
  transform: translateY(-2px);
  filter: brightness(1.06);
  box-shadow: 0 8px 28px var(--primary-glow);
}
.success-message {
  margin-top: 24px;
  padding: 16px;
  background: var(--primary-subtle);
  color: var(--primary);
  border: 1px solid var(--primary-border);
  border-radius: 12px;
  text-align: center;
  font-weight: 600;
}

@media (max-width: 600px) {
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  .report-form-section {
    padding: 24px;
  }
}
</style>
