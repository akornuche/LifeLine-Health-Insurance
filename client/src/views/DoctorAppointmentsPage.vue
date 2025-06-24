<template>
  <div class="dashboard">
    <h1 class="text-2xl font-bold mb-4">All Appointments</h1>
    <AppointmentList
      :appointments="appointments"
      @view-details="handleView"
      @reschedule="handleReschedule"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AppointmentList from '@/components/AppointmentList.vue';

const appointments = ref([]);
const user = JSON.parse(localStorage.getItem('user') || '{}');

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/appointments');
  const all = await res.json();
  appointments.value = all.filter(a => a.doctorId === user.id);
});

function handleView(appt) {
  alert(`Viewing appointment for ${appt.patientName}`);
}
function handleReschedule(appt) {
  alert(`Rescheduling appointment for ${appt.patientName}`);
}
</script>

<style scoped>
.dashboard {
  padding: 30px;
}
</style>
