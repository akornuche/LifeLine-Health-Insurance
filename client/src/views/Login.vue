<template>
  <div class="login-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>

      <div>
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
      </div>

      <div>
        <label for="userType">User Type:</label>
        <select v-model="userType" id="userType" required>
          <option disabled value="">Select User Type</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="hospital">Hospital</option>
          <option value="admin">Admin</option> <!-- Add if admin login uses same page -->
        </select>
      </div>

      <button type="submit">Login</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      userType: '',
      error: ''
    };
  },

  methods: {
    async login() {
      this.error = '';

      if (!this.userType) {
        this.error = 'Please select a user type.';
        return;
      }

      try {
        const res = await axios.post('http://localhost:3000/api/login', {
          email: this.email,
          password: this.password,
          userType: this.userType
        });

        const user = res.data.user;

        if (user.role !== this.userType) {
          this.error = 'Selected user type does not match account type.';
          return;
        }

        localStorage.setItem('userType', user.role);
        localStorage.setItem('userEmail', user.email);

        // Redirect based on role
        const dashboardMap = {
          patient: '/dashboard/patient',
          doctor: '/dashboard/doctor',
          pharmacy: '/dashboard/pharmacy',
          hospital: '/dashboard/hospital',
          admin: '/dashboard/admin'
        };

        this.$router.push(dashboardMap[user.role] || '/dashboard');

      } catch (err) {
        const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
        this.error = msg;
        console.error('Login error:', err);
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}
label {
  display: block;
  margin-bottom: 0.3rem;
}
input, select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
button {
  background-color: #0066b3;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  cursor: pointer;
  border-radius: 5px;
}
button:hover {
  background-color: #00539e;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
