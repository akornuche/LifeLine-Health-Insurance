<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Admin Dashboard</h2>
    <ul>
      <li>📊 View system stats and analytics</li>
      <li>👥 Manage all users</li>
      <li>🧾 Oversee all records</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'AdminDashboard',

  mounted() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'admin') {
      alert('Access denied');
      this.$router.push('/');
    }
  }
};
</script>