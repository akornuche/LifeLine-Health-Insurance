<template>
  <div class="payment-container">
    <div class="payment-card">
      <h2>Complete Your Payment</h2>
      <p>Please confirm your details and proceed with the payment.</p>

      <div class="payment-details">
        <div class="detail-item">
          <label>Email:</label>
          <span>{{ userEmail }}</span>
        </div>
        <div class="detail-item">
          <label>Amount:</label>
          <span>₦10,000</span>
        </div>
        <div class="detail-item">
          <label>Plan:</label>
          <span>1-Year Subscription</span>
        </div>
      </div>

      <button @click="makePayment" class="pay-button">Pay Now</button>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MakePayment',
  data() {
    return {
      userEmail: '',
      error: ''
    };
  },
 mounted() {
  const patientData = JSON.parse(localStorage.getItem('pendingPatientData'));

  if (!patientData?.email) {
    this.error = 'Missing registration data. Please start from the registration page.';
    this.$router.push('/register'); // Optional redirect
  } else {
    this.userEmail = patientData.email;
  }
},
  methods: {
    async makePayment() {
  this.loading = true;
  this.error = '';

  try {
    const patientData = JSON.parse(localStorage.getItem('pendingPatientData'));

    if (!patientData?.email) {
      this.error = 'Missing patient data. Please go back and register.';
      return;
    }

    const paymentPayload = {
      email: patientData.email,
      name: patientData.name,
      phone: patientData.phone,
      amount: 1500,
      method: 'card'
    };

    const res = await axios.post('http://localhost:3000/api/payment', paymentPayload);

    const user = {
      ...patientData,
      paymentStatus: 'paid',
      paymentExpires: res.data.paymentExpires,
      lastPaymentId: res.data.paymentId || null
    };

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.removeItem('pendingPatientData');

    alert('Payment successful! Valid until: ' + res.data.paymentExpires);
    this.$router.push('/dashboard/patient');

  } catch (err) {
    this.error = 'Payment failed: ' + (err.response?.data?.error || err.message);
  } finally {
    this.loading = false;
  }
}

  }
};
</script>

<style scoped>
.payment-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #f9f9f9;
}

.payment-card {
  background: #fff;
  padding: 30px 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
}

.payment-card h2 {
  margin-bottom: 10px;
}

.payment-card p {
  margin-bottom: 20px;
  color: #555;
}

.payment-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.pay-button {
  width: 100%;
  padding: 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.pay-button:hover {
  background-color: #45a049;
}

.error-message {
  margin-top: 15px;
  color: red;
  text-align: center;
}
</style>
