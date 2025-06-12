<template>
  <div class="dependents-page">
    <h2>Manage Dependents</h2>

    <!-- Add/Edit Form -->
    <form @submit.prevent="saveDependent">
      <input v-model="form.name" placeholder="Name" required />
      <input v-model="form.relation" placeholder="Relationship" required />
      <input type="number" v-model="form.age" placeholder="Age" required />
      <button type="submit" :disabled="hasReachedMax">
        {{ editingId !== null ? 'Update' : 'Add' }}
      </button>
      <button type="button" v-if="editingId !== null" @click="cancelEdit">Cancel</button>
    </form>
    <p v-if="hasReachedMax" style="color: red; font-size: 14px;">
      Maximum of 4 dependents reached. Please delete one to add a new dependent.
    </p>

    <!-- Dependents Table -->
    <table>
      <thead>
        <tr>
          <th>S/No</th>
          <th>Name of Dependent</th>
          <th>Relationship</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dependent, index) in dependents.slice(0, 4)" :key="dependent.id">
          <td>{{ index + 1 }}</td>
          <td>{{ dependent.name }}</td>
          <td>{{ dependent.relation }}</td>
          <td>{{ dependent.age }}</td>
        </tr>

        <tr v-if="dependents.length === 0">
          <td colspan="5">No dependents added yet.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue'
import axios from 'axios'

const dependents = ref([])
const editingId = ref(null)
const hasReachedMax = computed(() => dependents.value.length >= 4 && editingId.value === null)

const form = reactive({
  name: '',
  relation: '',
  age: ''
})

const loadDependents = async () => {
  try {
    const patientId = localStorage.getItem('patientId')
    if (!patientId) {
      alert('Access denied. Please log in again.')
      window.location.href = '/login' // Or use Vue Router: router.push('/login')
      return
    }

    const response = await axios.get('/api/dependents', {
      params: { patientId }
    })
    dependents.value = response.data
  } catch (error) {
    console.error('Failed to load dependents:', error)
  }
}

const saveDependent = async () => {
  try {
    const patientId = localStorage.getItem('patientId')
    if (!patientId) {
      alert('Patient ID missing. Please log in again.')
      return
    }

    if (editingId.value) {
      const response = await axios.put(`/api/dependents/${editingId.value}`, form)
      const index = dependents.value.findIndex(dep => dep.id === editingId.value)
      if (index !== -1) dependents.value[index] = response.data
    } else {
      const response = await axios.post('/api/dependents', {
        ...form,
        patientId
      })
      dependents.value.push(response.data)
    }

    resetForm()
  } catch (error) {
    console.error('Failed to save dependent:', error)
  }
}

const editDependent = (dependent) => {
  editingId.value = dependent.id
  form.name = dependent.name
  form.relation = dependent.relation
  form.age = dependent.age
}

const deleteDependent = async (id) => {
  if (confirm('Are you sure you want to delete this dependent?')) {
    try {
      await axios.delete(`/api/dependents/${id}`)
      dependents.value = dependents.value.filter(dep => dep.id !== id)
      if (editingId.value === id) {
        resetForm()
      }
    } catch (error) {
      console.error('Failed to delete dependent:', error)
    }
  }
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  form.name = ''
  form.relation = ''
  form.age = ''
  editingId.value = null
}

onMounted(() => {
  const patientId = localStorage.getItem('patientId');
  if (!patientId) {
    alert('Access denied. Please log in again.');
    window.location.href = '/login'; // or use router.push('/login')
    return;
  }
  loadDependents();
});

</script>


<style scoped>
.dependents-page {
  padding: 30px;
}
form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
input {
  padding: 8px;
}
button {
  padding: 8px 12px;
  cursor: pointer;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  padding: 12px;
  border: 1px solid #ccc;
}
</style>
