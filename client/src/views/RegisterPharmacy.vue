<template>
  <section class="form-section">
    <h2><i class="fas fa-prescription-bottle-alt"></i> Pharmacy Registration</h2>
    <form @submit.prevent="registerPharmacy">
      <input
        type="text"
        v-model="form.name"
        placeholder="Pharmacy Name"
        required
      />
      <input
        type="email"
        v-model="form.email"
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
        type="text"
        v-model="form.licenseNumber"
        placeholder="License Number"
        required
      />
      <input
        type="password"
        v-model="form.password"
        placeholder="Password"
        autocomplete="new-password"
        required
      />
      <button type="submit">Register</button>
    </form>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PharmacyRegistration',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',    
        licenseNumber: '',
        password: '',
        location: { lat: '', lng: '' }
      }
    };
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.form.location.lat = position.coords.latitude;
          this.form.location.lng = position.coords.longitude;
        },
        (error) => {
          console.error('Geolocation failed:', error);
          alert('We need your location to register you. Please enable location access and reload the page.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  },
  methods: {
    async registerPharmacy() {
      if (!this.form.location.lat || !this.form.location.lng) {
        return alert('Location is required to complete registration. Please enable location access.');
      }

      try {
        await axios.post('http://localhost:3000/api/pharmacies', this.form);
        alert('Registration successful!');
        this.$router.push('/login');
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
input {
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
