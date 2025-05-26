<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Pharmacy Dashboard</h2>
    <ul>
      <li>📄 View prescriptions</li>
      <li>✅ Mark prescriptions as fulfilled</li>
      <li>🔍 Access relevant patient data</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PharmacyDashboard',

  mounted() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'pharmacy') {
      alert('Access denied');
      this.$router.push('/');
    }
  }
};
</script>