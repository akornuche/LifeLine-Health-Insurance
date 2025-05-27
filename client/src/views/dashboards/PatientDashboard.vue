<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Welcome, Patient</h2>
    <p>Your assigned doctor, hospital, and pharmacy will appear here.</p>
    <ul>
      <li>📋 View personal medical records</li>
      <li>👨‍👩‍👧‍👦 View dependents</li>
      <li>📝 Request consultations or prescriptions</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'PatientDashboard',

  mounted() {
    const userType = localStorage.getItem('userType');
    if (userType !== 'patient') {
      alert('Access denied');
      this.$router.push('/');
    }
  }
};
</script>
