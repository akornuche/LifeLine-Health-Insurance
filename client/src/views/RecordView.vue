<template>
  <div class="p-4">
    <h2 class="text-lg font-semibold mb-2">Shared Medical Records</h2>
    <ul>
      <li v-for="record in filteredRecords" :key="record.id">
        🧾 {{ record.summary || 'Record Details' }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'RecordView',
  props: ['records', 'userRole'],
  computed: {
    filteredRecords() {
      if (this.userRole === 'admin') return this.records;
      return this.records.filter(r => r.role === this.userRole || r.public);
    }
  }
}
</script>