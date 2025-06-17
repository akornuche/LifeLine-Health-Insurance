<template>
  <div class="p-4 bg-white shadow-md rounded-2xl">
    <h2 class="text-xl font-semibold mb-4">Prescriptions</h2>
    <div v-if="prescriptions.length > 0">
      <table class="min-w-full text-left text-sm border rounded-lg">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 px-4">Patient</th>
            <th class="py-2 px-4">Medication</th>
            <th class="py-2 px-4">Dosage</th>
            <th class="py-2 px-4">Date</th>
            <th class="py-2 px-4">Status</th>
            <th class="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="prescription in prescriptions" :key="prescription.id" class="border-b">
            <td class="py-2 px-4">{{ prescription.patientName }}</td>
            <td class="py-2 px-4">{{ prescription.medication }}</td>
            <td class="py-2 px-4">{{ prescription.dosage }}</td>
            <td class="py-2 px-4">{{ formatDate(prescription.date) }}</td>
            <td class="py-2 px-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusClass(prescription.status)
                ]"
              >
                {{ prescription.status }}
              </span>
            </td>
            <td class="py-2 px-4">
             <!-- <button
                @click="$emit('view', prescription)"
                class="text-blue-600 hover:underline text-sm"
              >
                View
              </button> -->
              <button
                v-if="prescription.status === 'Pending'"
                @click="$emit('fulfill', prescription)"
                class="text-green-600 hover:underline text-sm ml-2"
              >
                Fulfill
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 text-sm">No prescriptions available.</p>
  </div>
</template>

<script>
export default {
  name: 'PrescriptionList',
  props: {
    prescriptions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    },
    getStatusClass(status) {
      switch (status) {
        case 'Fulfilled':
          return 'bg-green-100 text-green-700';
        case 'Pending':
          return 'bg-yellow-100 text-yellow-700';
        default:
          return 'bg-gray-200 text-gray-600';
      }
    },
  },
};
</script>

<style scoped>
table th,
table td {
  border-right: 1px solid #e5e7eb;
}
table th:last-child,
table td:last-child {
  border-right: none;
}
</style>
