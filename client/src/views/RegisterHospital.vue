<template>
  <section class="form-section">
    <h2><i class="fas fa-hospital"></i> Hospital Registration</h2>
    <form>
      <input type="text" placeholder="Hospital Name" required />
      <input type="email" placeholder="Email" required />
      <input type="text" placeholder="License Number" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Register</button>
    </form>
  </section>
</template>

<script>
export default {
  name: 'HospitalRegistration'
};
</script>