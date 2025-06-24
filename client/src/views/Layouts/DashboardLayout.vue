<template>
  <div class="container">
    <aside class="sidebar">
      <div class="logo">Medical Insurance</div>
      <div class="user-profile">
        <img :src="profileImage" alt="User Profile" />
        <h3>{{ user?.name || 'User' }}</h3>
        <p class="role">{{ roleLabel }}</p>
      </div>

      <nav>
        <router-link
          v-for="item in navLinks"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          active-class="active"
        >
          {{ item.label }}
        </router-link>
      </nav>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const user = ref(null);
const profileImage = ref('');
const roleLabel = ref('');

const navLinks = ref([]);

onMounted(() => {
  const stored = localStorage.getItem('user');
  if (stored) {
    user.value = JSON.parse(stored);
    const gender = user.value.gender?.toLowerCase();

    // Fallback image based on gender
    const fallbackImage = gender === 'female'
      ? 'https://randomuser.me/api/portraits/women/44.jpg'
      : 'https://randomuser.me/api/portraits/men/44.jpg';

    profileImage.value = user.value.photoUrl || fallbackImage;

    const role = user.value.role || '';
    roleLabel.value = {
      doctor: 'Medical Personnel',
      patient: 'Patient',
      pharmacy: 'Pharmacy',
      hospital: 'Hospital',
      admin: 'Admin'
    }[role] || 'User';

    // Dynamically assign nav items per role
    navLinks.value = {
      doctor: [
        { label: 'Dashboard', path: '/dashboard/doctor' },
        { label: 'My Patients', path: '/dashboard/doctor/patients' },
        { label: 'All Appointments', path: '/dashboard/doctor/appointments' },
        { label: 'All Prescriptions', path: '/dashboard/doctor/prescriptions' },
        { label: 'Settings', path: '' },
      ],
      patient: [
        { label: 'Dashboard', path: '/dashboard/patient' },
        { label: 'Dependents', path: '/dashboard/patient/dependents' },
        { label: 'Upgrade Cover', path: '/dashboard/patient/upgrade-cover' },
        { label: 'Settings', path: '' },
      ],
      pharmacy: [
        { label: 'Dashboard', path: '/dashboard/pharmacy' },
        { label: 'All Patients', path: '/dashboard/pharmacy/patients' },
        { label: 'All Prescriptions', path: '/dashboard/pharmacy/prescriptions' },
        { label: 'Settings', path: '' },
      ],
      hospital: [
        { label: 'Dashboard', path: '/dashboard/hospital' },
        { label: 'All Patients', path: '/dashboard/hospital/patients' },
        { label: 'All Appointments', path: '/dashboard/hospital/appointments' },
        { label: 'Settings', path: '' },
      ]
    }[role] || [];
  }
});

</script>

<style scoped>
/* Base & Reset */
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background: #f4f7fc;
  color: #374151;
}
a {
  color: #2563eb;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

/* Layout */
.container {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #1f2937;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.05);
}
.sidebar .logo {
  padding: 20px;
  font-weight: bold;
  font-size: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #374151;
}
.sidebar .user-profile {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #374151;
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
  transition: all 0.2s ease;
}
.sidebar nav a.active,
.sidebar nav a:hover {
  background-color: #374151;
  border-left-color: #3b82f6;
  color: #ffffff;
}

/* Main Content */
.main-content {
  flex-grow: 1;
  padding: 30px;
  overflow-y: auto;
}

/* Dashboard */
.dashboard h1 {
  margin: 0 0 25px 0;
  font-weight: 700;
  font-size: 2rem;
  color: #1e293b;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}
.stat-card:hover {
  transform: translateY(-2px);
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
}
.stat-card .details .number {
  font-size: 1.6rem;
  font-weight: bold;
  color: #1e293b;
}
.stat-card .details .label {
  font-size: 0.9rem;
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
  border-radius: 10px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
}
.panel h2 {
  margin-bottom: 16px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #111827;
}
.panel ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.panel ul li {
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
}
.panel ul li:last-child {
  border-bottom: none;
}
.panel .btn-more {
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
    justify-content: space-around;
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

/* Patient Details Card */
#patient-details-card {
  background: #ffffff;
  padding: 1rem;
  margin-top: 1rem;
  border-radius: 8px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
  max-width: 480px;
  transition: all 0.2s ease;
}
</style>

