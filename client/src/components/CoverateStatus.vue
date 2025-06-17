<template>
  <div class="p-4 bg-white shadow-md rounded-2xl w-full">
    <h2 class="text-xl font-semibold mb-4">Insurance Coverage</h2>

    <div v-if="coverage">
      <div class="mb-2">
        <span class="font-medium">Package:</span>
        <span :class="['ml-2 px-3 py-1 rounded-full text-sm font-semibold', getPackageClass(coverage.package)]">
          {{ coverage.package || 'None' }}
        </span>
      </div>
      <div class="mb-2">
        <span class="font-medium">Valid Until:</span>
        <span class="ml-2">{{ formatDate(coverage.validUntil) }}</span>
      </div>
      <div>
        <span class="font-medium">Status:</span>
        <span :class="['ml-2 font-semibold', isExpired ? 'text-red-600' : 'text-green-600']">
          {{ isExpired ? 'Expired' : 'Active' }}
        </span>
      </div>
    </div>

    <p v-else class="text-gray-500 text-sm">No coverage information available.</p>
  </div>
</template>

<script>
export default {
  name: 'CoverageStatus',
  props: {
    coverage: {
      type: Object,
      required: false,
      default: null
    },
  },
  computed: {
    isExpired() {
      if (!this.coverage || !this.coverage.validUntil) return true;
      return new Date(this.coverage.validUntil) < new Date();
    }
  },
  methods: {
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    },
    getPackageClass(pkg) {
      switch (pkg) {
        case 'Classic':
          return 'bg-green-100 text-green-700';
        case 'Gold':
          return 'bg-yellow-100 text-yellow-700';
        case 'Platinum':
          return 'bg-purple-100 text-purple-700';
        default:
          return 'bg-gray-200 text-gray-600';
      }
    }
  }
};
</script>
