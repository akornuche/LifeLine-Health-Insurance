<template>
  <div class="upgrade-container">
    <h1>Upgrade Your Insurance Plan</h1>
    <p>Select a plan that suits your medical needs.</p>

    <div class="plans">
      <div 
        class="plan-card"
        v-for="(plan, index) in plans" 
        :key="index" 
        :class="{ selected: selectedPlan === plan.name }"
        @click="selectPlan(plan.name)"
      >
        <h2>{{ plan.name }}</h2>
        <p class="price">₦{{ plan.price.toLocaleString() }}/year</p>
        <ul>
          <li v-for="(benefit, idx) in plan.benefits" :key="idx">{{ benefit }}</li>
        </ul>
      </div>
    </div>

    <button 
      class="confirm-btn" 
      :disabled="!selectedPlan"
      @click="confirmUpgrade"
    >
      Confirm Upgrade to {{ selectedPlan }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedPlan = ref('');

const plans = [
  {
    name: 'Classic',
    price: 3500,
    benefits: ['Covers all common illnesses treatment and drugs']
  },
  {
    name: 'Gold',
    price: 5500,
    benefits: ['Includes Classic package  benefits', 'Covers minor surgeries']
  },
  {
    name: 'Platinum',
    price: 10000,
    benefits: ['Includes Gold package benefits', 'Covers major surgeries', 'Childbirth coverage']
  }
];

function selectPlan(planName) {
  selectedPlan.value = planName;
}

function confirmUpgrade() {
  // Simulate API call or save to localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  if (user) {
    user.upgradedPlan = selectedPlan.value;
    localStorage.setItem('user', JSON.stringify(user));
  }

  alert(`Successfully upgraded to ${selectedPlan.value} package!`);
  router.push('/dashboard/patient');
}
</script>

<style scoped>
.upgrade-container {
  padding: 2rem;
  text-align: center;
}
.plans {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.plan-card {
  border: 2px solid #ccc;
  padding: 1rem;
  width: 250px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.plan-card.selected {
  border-color: #10b981;
  background-color: #f0fdf4;
}
.price {
  font-weight: bold;
  margin: 1rem 0;
}
.confirm-btn {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.confirm-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
