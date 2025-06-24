<template>
  <div class="p-4 bg-white shadow-md rounded-2xl">
    <h2 class="text-xl font-semibold mb-4">Appointments</h2>
    <div v-if="appointments.length > 0">
      <table class="min-w-full text-left text-sm border rounded-lg">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-2 px-4">Patient Name</th>
            <th class="py-2 px-4">Date & Time</th>
            <th class="py-2 px-4">Type</th>
            <th class="py-2 px-4">Status</th>
            <th class="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appointment in appointments" :key="appointment.id" class="border-b">
            <td class="py-2 px-4">{{ appointment.patientName }}</td>
            <td class="py-2 px-4">{{ formatDate(appointment.dateTime) }}</td>
            <td class="py-2 px-4">{{ appointment.type }}</td>
            <td class="py-2 px-4">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  getStatusClass(appointment.status)
                ]"
              >
                {{ appointment.status }}
              </span>
            </td>
            <td class="py-2 px-4">
              <!-- <button
                @click="$emit('view-details', appointment)"
                class="text-blue-600 hover:underline text-sm"
              >
                Details
              </button> -->
              <button
                @click="$emit('reschedule', appointment)"
                class="text-orange-600 hover:underline text-sm ml-2"
              >
                Reschedule
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="text-gray-500 text-sm">No appointments found.</p>
  </div>
</template>

<script>
export default {
  name: 'AppointmentList',
  props: {
    appointments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatDate(dateTime) {
      const date = new Date(dateTime);
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    getStatusClass(status) {
      switch (status) {
        case 'Pending':
          return 'bg-yellow-100 text-yellow-700';
        case 'Confirmed':
          return 'bg-green-100 text-green-700';
        case 'Completed':
          return 'bg-blue-100 text-blue-700';
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
