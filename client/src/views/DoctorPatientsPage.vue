<template>
  <div class="dashboard">
    <h1 class="text-2xl font-bold mb-4">All My Patients</h1>
    <PatientList :patients="patients" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PatientList from '@/components/PatientList.vue';

const patients = ref([]);
const user = JSON.parse(localStorage.getItem('user') || '{}');

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/patients');
  const all = await res.json();
  patients.value = all.filter(p => p.assignedDoctorId === user.id);
});
</script>

<style scoped>
.dashboard {
  padding: 30px;
}
</style>
