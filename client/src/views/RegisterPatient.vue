<template>
  <section class="form-section">
    <h2><i class="fas fa-user-plus"></i> Patient Registration</h2>
    <form @submit.prevent="registerPatient">
      <input
        type="text"
        v-model="form.name"
        placeholder="Full Name"
        required
      />
      <input
        type="email"
        v-model="form.email"
        placeholder="Email"
        required
      />
      <input
        type="tel"
        v-model="form.phone"
        placeholder="Phone Number"
        required
      />
      <input
        type="password"
        v-model="form.password"
        placeholder="Password"
        required
      />

      <!-- ✅ Gender Select -->
      <select v-model="form.gender" required>
        <option disabled value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <!-- ✅ Optional Profile Picture URL -->
      <input
        type="url"
        v-model="form.photoUrl"
        placeholder="Profile Picture URL (optional)"
      />

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
        gender: '',
        photoUrl: '',
        location: { lat: '', lng: '' }
      }
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.form.location.lat = pos.coords.latitude;
          this.form.location.lng = pos.coords.longitude;
        },
        (err) => {
          console.error('Geolocation failed:', err);
          alert('We need your location to register you. Please enable location access and reload.');
        }
      );
    } else {
      alert('Geolocation not supported by your browser.');
    }
  },
  methods: {
    async registerPatient() {
      if (!this.form.location.lat || !this.form.location.lng) {
        return alert('Location is required. Please enable location access.');
      }

      try {
        const response = await axios.post('http://localhost:3000/api/patients', this.form);
        alert('Registration successful!');
        this.$router.push('/payment');
      } catch (error) {
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
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
input, select {
  display: block;
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem;
}
button {
  margin-top: 1rem;
  padding: 0.5rem;
  width: 100%;
}
</style>
