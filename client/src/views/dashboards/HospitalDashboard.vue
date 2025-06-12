<template>
  <div class="container">
    <aside class="sidebar">
      <div class="logo">Medical Insurance</div>
      <div class="user-profile">
        <img :src="profileImage" alt="Hospital Profile" />
        <h3>{{ user?.name || 'Hospital' }}</h3>
        <p style="color:#6b7280;">Hospital Staff</p>
      </div>
      <nav>
        <a href="#" class="active">Dashboard</a>
        <a href="#">Patient Admissions</a>
        <a href="#">Medical Records</a>
        <a href="#">Appointments</a>
        <a href="#">Settings</a>
      </nav>
    </aside>

    <main class="main-content">
      <section class="dashboard">
        <h1>Welcome, {{ user?.name?.split(' ')[0] || 'Hospital Admin' }}!</h1>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="icon">🛏️</div>
            <div class="details">
              <div class="number">{{ admittedPatients }}</div>
              <div class="label">Admitted Patients</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="icon">📋</div>
            <div class="details">
              <div class="number">{{ medicalRecords }}</div>
              <div class="label">Medical Records</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="icon">📆</div>
            <div class="details">
              <div class="number">{{ appointments }}</div>
              <div class="label">Upcoming Appointments</div>
            </div>
          </div>
        </div>

        <div class="panels">
          <section class="panel">
            <h2>Recent Admissions</h2>
            <ul>
              <li><strong>Jane Doe</strong> - Admitted June 2, 2025</li>
              <li><strong>Mark Smith</strong> - Admitted June 1, 2025</li>
            </ul>
            <button class="btn-more">View All</button>
          </section>

          <section class="panel">
            <h2>Upcoming Surgeries</h2>
            <ul>
              <li><strong>Appendectomy</strong> - June 6, 2025</li>
              <li><strong>Knee Replacement</strong> - June 7, 2025</li>
            </ul>
            <button class="btn-more">View Schedule</button>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const user = ref(null);
const profileImage = ref('');
const admittedPatients = ref(0);
const medicalRecords = ref(0);
const appointments = ref(0);

onMounted(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    user.value = JSON.parse(stored);
    profileImage.value = user.value.photoUrl || 'https://randomuser.me/api/portraits/men/50.jpg';

    // Simulated hospital stats
    admittedPatients.value = 12;
    medicalRecords.value = 84;
    appointments.value = 5;
  }
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
