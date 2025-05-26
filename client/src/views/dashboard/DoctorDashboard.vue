<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Doctor Dashboard</h2>
    <ul>
      <li>👥 View assigned patients</li>
      <li>🩺 Access and update patient records</li>
      <li>💊 Add prescriptions</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DoctorDashboard',

  mounted() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'doctor') {
      alert('Access denied');
      this.$router.push('/');
    }
  }
};
</script>