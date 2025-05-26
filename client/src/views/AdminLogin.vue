<template>
  <section class="form-section">
    <h2><i class="fas fa-user-shield"></i> Admin Login</h2>
    <form>
      <input type="text" placeholder="Admin Username" required />
      <input type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </section>
</template>

<script>
export default {
  name: 'AdminLogin'
};
</script>