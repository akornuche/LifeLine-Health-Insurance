<template>
  <section class="form-section">
    <h2><i class="fas fa-prescription-bottle-alt"></i> Pharmacy Registration</h2>
    <form>
      <input type="text" placeholder="Pharmacy Name" required />
      <input type="email" placeholder="Email" required />
      <input type="text" placeholder="License Number" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </section>
</template>

<script>
export default {
  name: 'PharmacyRegistration'
};
</script>