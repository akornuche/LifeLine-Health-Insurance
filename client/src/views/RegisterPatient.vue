<template>
  <section class="form-section">
    <h2><i class="fas fa-user-plus"></i> Patient Registration</h2>
    <form @submit.prevent="registerPatient">
      <input
        type="text"
        v-model="form.name"
        id="name"
        name="name"
        placeholder="Full Name"
        autocomplete="name"
        required
      />
      <input
        type="email"
        v-model="form.email"
        id="email"
        name="email"
        placeholder="Email"
        autocomplete="email"
        required
      />
      <input
        type="tel"
        v-model="form.phone"
        id="phone"
        name="phone"
        placeholder="Phone Number"
        autocomplete="tel"
        required
      />
      <input
        type="password"
        v-model="form.password"
        id="password"
        name="password"
        placeholder="Password"
        autocomplete="new-password"
        required
      />

      <input
        type="number"
        v-model.number="form.payment"
        id="payment"
        name="payment"
        placeholder="Payment Amount (₦)"
        required
      />

      <div class="location-fields">
        <input
          type="number"
          step="any"
          v-model="form.location.lat"
          placeholder="Latitude"
          required
        />
        <input
          type="number"
          step="any"
          v-model="form.location.lng"
          placeholder="Longitude"
          required
        />
      </div>

      <div class="dependents">
        <label>Dependents (max 4):</label>
        <div v-for="(dep, index) in form.dependents" :key="index" class="dependent">
          <input
            type="text"
            v-model="form.dependents[index]"
            :placeholder="`Dependent ${index + 1}`"
          />
          <button type="button" @click="removeDependent(index)">✕</button>
        </div>
        <button type="button" @click="addDependent" :disabled="form.dependents.length >= 4">
          + Add Dependent
        </button>
      </div>

      <button type="submit">Register</button>
    </form>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegisterPatient',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        password: '',
        payment: 1500,
        location: { lat: '', lng: '' },
        dependents: []
      }
    };
  },
  methods: {
    async registerPatient() {
      if (this.form.payment < 1500) {
        return alert('Minimum payment is ₦1500');
      }

      try {
        const response = await axios.post('http://localhost:3000/api/patients', this.form);
        alert('Registration successful!');
        this.$router.push('/login');
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    },
    addDependent() {
      if (this.form.dependents.length < 4) {
        this.form.dependents.push('');
      }
    },
    removeDependent(index) {
      this.form.dependents.splice(index, 1);
    }
  }
};
</script>

<style scoped>
.form-section {
  max-width: 500px;
  margin: auto;
  padding: 1rem;
}
input {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
}
.dependents {
  margin: 1rem 0;
}
.dependent {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
button {
  margin-top: 1rem;
  padding: 0.5rem;
  width: 100%;
}
.location-fields {
  display: flex;
  gap: 1rem;
}
</style>
