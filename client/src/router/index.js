
import { createRouter, createWebHistory } from 'vue-router';

// Main views
import Home from '../views/Home.vue';
import RegisterPatient from '../views/RegisterPatient.vue';
import RegisterDoctor from '../views/RegisterDoctor.vue';
import RegisterHospital from '../views/RegisterHospital.vue';
import RegisterPharmacy from '../views/RegisterPharmacy.vue';
import Login from '../views/Login.vue';
import AdminLogin from '../views/AdminLogin.vue';

// Dashboard views
import PatientDashboard from '../views/dashboards/PatientDashboard.vue';
import DoctorDashboard from '../views/dashboards/DoctorDashboard.vue';
import PharmacyDashboard from '../views/dashboards/PharmacyDashboard.vue';
import HospitalDashboard from '../views/dashboards/HospitalDashboard.vue';
import AdminDashboard from '../views/dashboards/AdminDashboard.vue';

const routes = [
  // Main public pages
  { path: '/', name: 'Home', component: Home },
  { path: '/login', component: Login },
  { path: '/admin/login', component: AdminLogin },
  { path: '/register/patient', component: RegisterPatient },
  { path: '/register/doctor', component: RegisterDoctor },
  { path: '/register/hospital', component: RegisterHospital },
  { path: '/register/pharmacy', component: RegisterPharmacy },

  // Dynamic redirect to correct dashboard
  {
    path: '/dashboard',
    redirect: () => {
      const type = localStorage.getItem('userType');
      switch (type) {
        case 'doctor': return '/dashboard/doctor';
        case 'pharmacy': return '/dashboard/pharmacy';
        case 'hospital': return '/dashboard/hospital';
        case 'admin': return '/dashboard/admin';
        default: return '/dashboard/patient'; // fallback
      }
    }
  },

  // Dashboard routes
  { path: '/dashboard/patient', name: 'PatientDashboard', component: PatientDashboard },
  { path: '/dashboard/doctor', name: 'DoctorDashboard', component: DoctorDashboard },
  { path: '/dashboard/pharmacy', name: 'PharmacyDashboard', component: PharmacyDashboard },
  { path: '/dashboard/hospital', name: 'HospitalDashboard', component: HospitalDashboard },
  { path: '/dashboard/admin', name: 'AdminDashboard', component: AdminDashboard },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
