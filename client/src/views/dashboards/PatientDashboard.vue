<template>
  <div class="container">
    
    <main class="main-content">
      <section class="dashboard" aria-label="Patient Dashboard Overview">
        <h1>Welcome back, {{ user?.name?.split(' ')[0] || 'Patient' }}!</h1>

        <div class="stats-grid" role="list">
          <div class="stat-card" role="listitem" aria-label="Active Insurance">
            <div class="icon" aria-hidden="true">🛡️</div>
            <div class="details">
              <div class="number">No Extra Policy Cover</div>
              <div class="label">#12345678</div>
            </div>
          </div>

          <div class="stat-card" role="listitem" aria-label="Payment Status">
            <div class="icon" aria-hidden="true">💳</div>
            <div class="details">
              <div
                class="number"
                :style="{ color: paymentStatus === 'paid' ? '#10b981' : '#ef4444' }"
              >
                {{ paymentStatus === 'paid' ? 'Paid' : 'Unpaid' }}
              </div>
              <div class="label">General Insurance {{ paymentStatus === 'paid' ? 'Active' : 'Inactive' }}</div>
            </div>
          </div>

          <div class="stat-card" role="listitem" aria-label="Dependents">
            <div class="icon" aria-hidden="true">👨‍👩‍👧‍👦</div>
            <div class="details">
              <div class="number">{{ dependentCount }}</div>
              <div class="label">Dependents</div>
            </div>
          </div>

          <div class="stat-card" role="listitem" aria-label="Assigned Doctor">
            <div class="icon" aria-hidden="true">🩺</div>
            <div class="details">
              <div class="number">Dr. Smith</div>
              <div class="label">Assigned Doctor</div>
            </div>
          </div>
        </div>

        <div class="panels" role="region" aria-label="Appointments Panels">
          <section class="panel" aria-labelledby="previousAppointmentsTitle">
            <h2 id="previousAppointmentsTitle">
              Previous Appointments
              <span class="date">June 30, 2025</span>
            </h2>
            <ul>
              <li><strong>Annual Checkup</strong> - June 15, 2025 at 10:00 AM</li>
              <li><strong>Dental Cleaning</strong> - May 1, 2025 at 2:30 PM</li>
            </ul>
            <button class="btn-more" aria-label="Read more previous appointments">
              Read More
            </button>
          </section>

          <section class="panel" aria-labelledby="pendingAppointmentsTitle">
            <h2 id="pendingAppointmentsTitle">Pending Appointments</h2>
            <ul>
              <li><strong>Follow-up Consultation</strong> - Pending user confirmation</li>
            </ul>
            <button class="btn-more" aria-label="Read more pending appointments">
              Read More
            </button>
          </section>
        </div>
      </section>
      <section>
  <h2>Current Month's Charges</h2>
  <table>
    <thead>
      <tr>
        <th>Service</th>
        <th>Amount</th>
        <th>Date</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cost in monthlyCharges" :key="cost.id">
        <td>{{ cost.service }}</td>
        <td>₦{{ cost.amount.toLocaleString() }}</td>
        <td>{{ new Date(cost.date).toLocaleDateString() }}</td>
        <td :class="{ unpaid: cost.status === 'unpaid', paid: cost.status === 'paid' }">
          {{ cost.status }}
        </td>
      </tr>
    </tbody>
  </table>
</section>

    </main>
    
  </div>
</template>


<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';

const user = ref(null);
const profileImage = ref('');
const paymentStatus = ref('Unpaid');
const dependentCount = ref(0);

const patientCosts = ref([]);
const recentCharges = ref([]);
const unpaidCosts = ref([]);
const totalUnpaidAmount = ref(0);

const dropdownOpen = ref(false);

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

function closeDropdownOnClickOutside(event) {
  const dropdown = document.querySelector('.profile-dropdown');
  if (dropdown && !dropdown.contains(event.target)) {
    dropdownOpen.value = false;
  }
}

onMounted(async () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    paymentStatus.value = user.value.paymentStatus || 'Unpaid';

    // Profile image fallback
    const gender = user.value.gender?.toLowerCase();
    profileImage.value = user.value.photoUrl ||
      (gender === 'female'
        ? 'https://randomuser.me/api/portraits/women/44.jpg'
        : gender === 'male'
        ? 'https://randomuser.me/api/portraits/men/44.jpg'
        : 'https://randomuser.me/api/portraits/lego/1.jpg');

    // Fetch dependents
    try {
      const res = await axios.get(`http://localhost:3000/api/dependents?patientId=${user.value.id}`);
      dependentCount.value = res.data.length;
    } catch (error) {
      console.error('Error fetching dependents:', error);
    }

    // Fetch current month's costs only
    try {
      const costRes = await axios.get('http://localhost:3000/api/costs/monthly');
      const allCosts = costRes.data;

      // Filter costs for this patient
      const myCosts = allCosts.filter(c => c.patientId === user.value.id);

      recentCharges.value = myCosts;
      unpaidCosts.value = myCosts.filter(c => c.status === 'unpaid');
      totalUnpaidAmount.value = unpaidCosts.value.reduce((sum, c) => sum + c.amount, 0);
    } catch (error) {
      console.error('Error fetching patient costs:', error);
    }
  }

  window.addEventListener('click', closeDropdownOnClickOutside);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside);
});
</script>



<style scoped>
/* Reset & base */
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f7fc;
  color: #333;
}
a {
  color: #2a7ae2;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* Layout */
.container {
  display: flex;
  min-height: 100vh;
}
/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #1f2937;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
}
.sidebar .logo {
  padding: 20px;
  font-weight: bold;
  font-size: 1.4rem;
  text-align: center;
  border-bottom: 1px solid #374151;
}
.sidebar .user-profile {
  padding: 20px;
  border-bottom: 1px solid #374151;
  text-align: center;
}
.sidebar .user-profile img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #3b82f6;
}
.sidebar .user-profile h3 {
  margin: 0;
  font-size: 1.2rem;
}
.sidebar nav {
  flex-grow: 1;
  padding: 15px 0;
}
.sidebar nav a {
  display: block;
  padding: 12px 30px;
  font-weight: 600;
  color: #9ca3af;
  border-left: 4px solid transparent;
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}
.sidebar nav a.active,
.sidebar nav a:hover {
  background-color: #374151;
  border-left-color: #3b82f6;
  color: #fff;
}

/* Main content */
.main-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}
/* Topbar */
.topbar {
  background: white;
  padding: 10px 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.topbar .menu-toggle {
  font-size: 1.4rem;
  cursor: pointer;
  color: #374151;
  display: none; /* For responsiveness if you want */
}
.topbar .profile-dropdown {
  position: relative;
  user-select: none;
}
.topbar .profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #374151;
}
.topbar .profile-btn img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
  border: 2px solid #3b82f6;
}
.topbar .dropdown-menu {
  position: absolute;
  right: 0;
  top: 48px;
  background: white;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  border-radius: 6px;
  overflow: hidden;
  display: none;
  min-width: 140px;
  z-index: 10;
}
.topbar .dropdown-menu a {
  display: block;
  padding: 10px 15px;
  color: #374151;
  font-weight: 500;
}
.topbar .dropdown-menu a:hover {
  background-color: #e0e7ff;
  color: #1e40af;
}
.topbar .profile-dropdown.open .dropdown-menu {
  display: block;
}

/* Dashboard content */
.dashboard {
  padding: 25px 30px;
  overflow-y: auto;
  flex-grow: 1;
}
.dashboard h1 {
  margin-top: 0;
  margin-bottom: 25px;
  font-weight: 700;
  font-size: 2rem;
  color: #1e293b;
}

/* Stats cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 5px rgb(0 0 0 / 0.1);
  display: flex;
  align-items: center;
}
.stat-card .icon {
  background-color: #3b82f6;
  color: white;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.8rem;
  margin-right: 15px;
  flex-shrink: 0;
}
.stat-card .details {
  flex-grow: 1;
}
.stat-card .details .number {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 5px;
  color: #1e293b;
}
.stat-card .details .label {
  font-weight: 600;
  color: #6b7280;
}

/* Panels */
.panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  margin-bottom: 40px;
}
.panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgb(0 0 0 / 0.12);
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.panel h2 {
  margin-top: 0;
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 1.3rem;
  color: #111827;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.panel h2 .date {
  font-weight: 400;
  font-size: 0.9rem;
  color: #6b7280;
}
.panel ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
}
.panel ul li {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
}
.panel ul li:last-child {
  border-bottom: none;
}
.panel ul li strong {
  color: #2563eb;
}
.panel .btn-more {
  align-self: center;
  margin-top: 15px;
  padding: 8px 20px;
  font-size: 0.9rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.panel .btn-more:hover {
  background-color: #2563eb;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }
  .sidebar .user-profile {
    display: none;
  }
  .sidebar nav {
    display: flex;
    padding: 0;
  }
  .sidebar nav a {
    padding: 12px 15px;
    border-left: none;
    border-bottom: 4px solid transparent;
  }
  .sidebar nav a.active,
  .sidebar nav a:hover {
    border-left: none;
    border-bottom: 4px solid #3b82f6;
    background-color: transparent;
    color: #fff;
  }
  .panels {
    grid-template-columns: 1fr;
  }
}
</style>
