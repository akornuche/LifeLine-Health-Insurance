<template>
  <div id="home">

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <img src="/flyer1.jpg" alt="LifeLine Banner" class="hero-bg" />
    </section>

    <!-- About Section -->
    <section id="about" class="section">
      <h2>About LifeLine</h2>
      <p>Affordable ₦1500 subscription allows a patient to register and add up to 4 dependents for quality healthcare access.</p>
      <div class="features">
        <div class="card">Quality Diagnosis</div>
        <div class="card">Access to Medications</div>
        <div class="card">Licensed Healthcare Providers</div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="section light-bg" id="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <h3>Step 1</h3>
          <p>Register as a patient and add up to 4 dependents for ₦1500</p>
        </div>
        <div class="step">
          <h3>Step 2</h3>
          <p>Get assigned to doctors, pharmacies, or hospitals near you</p>
        </div>
        <div class="step">
          <h3>Step 3</h3>
          <p>Access treatment, prescriptions, and more through your dashboard</p>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="section">
      <h2>Service Categories</h2>
      <div class="services-grid">
        <div class="service">Doctors</div>
        <div class="service">Pharmacies</div>
        <div class="service">Hospitals</div>
        <div class="service">Emergency</div>
      </div>
    </section>

    <!-- Super Admin Teaser Section -->
    <section class="section light-bg">
      <h2>Super Admin Panel</h2>
      <p>Robust dashboard for complete management of user data, services, and operations.</p><br />
      <a href="#register" class="cta-button">Get Started</a>
      <a href="#" class="btn-download">Download App</a>
    </section>

  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>

<style scoped>
/* You can also import your global styles if needed */
</style>
