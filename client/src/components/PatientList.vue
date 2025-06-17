<template>
  <div class="p-4 bg-white shadow-md rounded-2xl">
    <h2 class="text-xl font-semibold mb-4">Patients</h2>
    <div v-if="patients.length > 0">
      <table class="min-w-full text-left text-sm border rounded-lg">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 px-4">Name</th>
            <th class="py-2 px-4">Age</th>
            <th class="py-2 px-4">Gender</th>
            <th class="py-2 px-4">Insurance</th>
            <th class="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id" class="border-b">
            <td class="py-2 px-4">{{ patient.name }}</td>
            <td class="py-2 px-4">{{ patient.age }}</td>
            <td class="py-2 px-4">{{ patient.gender }}</td>
            <td class="py-2 px-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getInsuranceClass(patient.insurancePackage)
                ]"
              >
                {{ patient.insurancePackage || 'None' }}
              </span>
            </td>
            <td class="py-2 px-4">
              <button
                @click="$emit('view', patient)"
                class="text-blue-600 hover:underline text-sm"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 text-sm">No patients found.</p>
  </div>
</template>

<script>
export default {
  name: 'PatientList',
  props: {
    patients: {
      type: Array,
      required: true,
    },
  },
  methods: {
    getInsuranceClass(packageType) {
      switch (packageType) {
        case 'Classic':
          return 'bg-green-100 text-green-700';
        case 'Gold':
          return 'bg-yellow-100 text-yellow-700';
        case 'Platinum':
          return 'bg-purple-100 text-purple-700';
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
