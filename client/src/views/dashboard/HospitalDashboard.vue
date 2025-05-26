<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Hospital Dashboard</h2>
    <ul>
      <li>🚑 Manage incoming patients</li>
      <li>🗂 Access and manage medical records</li>
      <li>🏥 Assign beds and coordinate care</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HospitalDashboard',

  mounted() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'hospital') {
      alert('Access denied');
      this.$router.push('/');
    }
  }
};
</script>