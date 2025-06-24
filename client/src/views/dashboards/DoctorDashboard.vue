<template>
  <div class="container">
   
    <main class="main-content">
      <section class="dashboard">
        <h1>Welcome back, Dr. {{ user?.name?.split(' ')[0] || 'Doctor' }}!</h1>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="icon">🧑‍⚕️</div>
            <div class="details">
              <div class="number">{{ patientCount }}</div>
              <div class="label">Assigned Patients</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="icon">📅</div>
            <div class="details">
              <div class="number">{{ appointments.length }}</div>
              <div class="label">Upcoming Appointments</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="icon">💊</div>
            <div class="details">
              <div class="number">{{ pendingPrescriptions }}</div>
              <div class="label">Pending Prescriptions</div>
            </div>
          </div>
        </div>
      </section>

      <!-- NEW COMPONENT SECTIONS BELOW -->

      <section class="dashboard-section">
        <PatientList :patients="patients" @view="handleViewPatient" />

        <!-- Patient Detail Modal or Section -->
          <div v-if="selectedPatient" id="patient-details-card">
            <h3>Patient Details</h3>
            <p><strong>Name:</strong> {{ selectedPatient.name }}</p>
            <p><strong>Email:</strong> {{ selectedPatient.email }}</p>
            <p><strong>Gender:</strong> {{ selectedPatient.gender }}</p>
            <p><strong>Package:</strong> {{ selectedPatient.insurancePackage }}</p>
            <p><strong>Payment Status:</strong> {{ selectedPatient.paymentStatus }}</p>
            <p><strong>Expires:</strong> {{ new Date(selectedPatient.paymentExpires).toLocaleDateString() }}</p>
            <button @click="selectedPatient = null">Close</button>
          </div>
      </section> <br>

      <section class="dashboard-section">
        <AppointmentList
          :appointments="appointments"
          @view-details="handleViewAppointment"
          @reschedule="handleReschedule"
        />
      </section> <br>

      <section class="dashboard-section">
        <PrescriptionList
          :prescriptions="prescriptions"
          @view="handleViewPrescription"
          @fulfill="handleFulfillPrescription"
        />
      </section><br>
      <section>
        <h2>Services Billed This Month</h2>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cost in doctorCosts" :key="cost.id">
              <td>{{ cost.patientName || 'Patient #' + cost.patientId }}</td>
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

      <section class="stat-card">
        <div class="icon">₦</div>
        <div class="details">
          <div class="number">₦{{ totalDoctorBilled.toLocaleString() }}</div>
          <div class="label">Total Services Billed (This Month)</div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PatientList from '@/components/PatientList.vue';
import AppointmentList from '@/components/AppointmentList.vue';
import PrescriptionList from '@/components/PrescriptionList.vue';

const user = ref(null);
const profileImage = ref('');
const patientCount = ref(0);
const appointments = ref([]);
const prescriptions = ref([]);
const patients = ref([]);
const pendingPrescriptions = ref(0);
const selectedPrescription = ref(null);
const doctorCosts = ref([]);
const totalDoctorBilled = ref(0);

onMounted(async () => {
  const stored = localStorage.getItem('user');
  if (stored) {
    user.value = JSON.parse(stored);
    profileImage.value = user.value.photoUrl || 'https://randomuser.me/api/portraits/men/12.jpg';

    const doctorId = user.value.id;

    try {
      // Fetch and filter patients
      const resPatients = await fetch('http://localhost:3000/api/patients');
      const allPatients = await resPatients.json();
      patients.value = allPatients.filter(p => p.assignedDoctorId === doctorId).slice(-5); // last 5

      // Fetch and filter appointments
      const resAppointments = await fetch('http://localhost:3000/api/appointments');
      const allAppointments = await resAppointments.json();
      appointments.value = allAppointments.filter(a => a.doctorId === doctorId && a.status !== 'Fulfilled');

      // Fetch and filter prescriptions
      const resPrescriptions = await fetch('http://localhost:3000/api/prescriptions');
      const allPrescriptions = await resPrescriptions.json();
      prescriptions.value = allPrescriptions.filter(p => p.doctorId === doctorId && p.status !== 'Fulfilled');
      pendingPrescriptions.value = prescriptions.value.filter(p => p.status === 'Pending').length;

      // ✅ Fetch this month's cost records for the doctor
      const resCosts = await fetch(`http://localhost:3000/api/costs/monthly?providerId=${doctorId}&providerType=doctor`);
      const costRecords = await resCosts.json();

      doctorCosts.value = costRecords;
      totalDoctorBilled.value = costRecords.reduce((sum, c) => sum + (c.amount || 0), 0);

    } catch (err) {
      console.error('Error fetching data:', err);
    }
  }
});

const selectedPatient = ref(null);

function handleViewPatient(patient) {
  selectedPatient.value = patient;
}

function handleViewAppointment(appointment) {
  alert(`Viewing appointment with ${appointment.patientName}`);
}

function handleReschedule(appointment) {
  alert(`Rescheduling appointment for ${appointment.patientName}`);
}

function handleViewPrescription(p) {
  selectedPrescription.value = p;
  // Show modal or detail panel
  console.log('Viewing:', p);
}

async function handleFulfillPrescription(prescription) {
  try {
    const res = await fetch(`http://localhost:3000/api/prescriptions/${prescription.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Fulfilled' }),
    });

    if (!res.ok) throw new Error('Failed to update prescription');

    const updated = await res.json();
    prescription.status = updated.prescription.status;
    pendingPrescriptions.value = prescriptions.value.filter(p => p.status === 'Pending').length;
  } catch (err) {
    console.error('Error fulfilling prescription:', err);
  }
}

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
