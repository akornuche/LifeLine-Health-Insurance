<template>
  <div class="dashboard">
    <h1 class="text-2xl font-bold mb-4">All Prescriptions</h1>
    <PrescriptionList
      :prescriptions="prescriptions"
      @view="handleView"
      @fulfill="handleFulfill"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PrescriptionList from '@/components/PrescriptionList.vue';

const prescriptions = ref([]);
const user = JSON.parse(localStorage.getItem('user') || '{}');

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/prescriptions');
  const all = await res.json();
  prescriptions.value = all.filter(p => p.doctorId === user.id);
});

function handleView(rx) {
  alert(`Viewing prescription for ${rx.patientName}`);
}
function handleFulfill(rx) {
  alert(`Fulfilling prescription: ${rx.medication}`);
}
</script>

<style scoped>
.dashboard {
  padding: 30px;
}
</style>
