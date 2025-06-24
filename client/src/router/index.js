import { createRouter, createWebHistory } from 'vue-router';

// Public views
import Home from '../views/Home.vue';
import RegisterPatient from '../views/RegisterPatient.vue';
import RegisterDoctor from '../views/RegisterDoctor.vue';
import RegisterHospital from '../views/RegisterHospital.vue';
import RegisterPharmacy from '../views/RegisterPharmacy.vue';
import Login from '../views/login.vue';
import AdminLogin from '../views/AdminLogin.vue';
import MakePayment from '../views/MakePayment.vue';

// Dashboard sub-pages
import DoctorPatientsPage from '../views/DoctorPatientsPage.vue';
import DoctorAppointmentsPage from '../views/DoctorAppointmentsPage.vue';
import DoctorPrescriptionsPage from '../views/DoctorPrescriptionsPage.vue';
import DependentsPage from '../views/DependentsPage.vue';
import UpgradeCover from '../views/UpgradeCover.vue';

// Dashboard views
import PatientDashboard from '../views/dashboards/PatientDashboard.vue';
import DoctorDashboard from '../views/dashboards/DoctorDashboard.vue';
import PharmacyDashboard from '../views/dashboards/PharmacyDashboard.vue';
import HospitalDashboard from '../views/dashboards/HospitalDashboard.vue';
import AdminDashboard from '../views/dashboards/AdminDashboard.vue';

// Shared layout
import DashboardLayout from '../views/layouts/DashboardLayout.vue';

const routes = [
  // Public
  { path: '/', name: 'Home', component: Home },
  { path: '/login', component: Login },
  { path: '/admin/login', component: AdminLogin },
  { path: '/register/patient', component: RegisterPatient },
  { path: '/register/doctor', component: RegisterDoctor },
  { path: '/register/hospital', component: RegisterHospital },
  { path: '/register/pharmacy', component: RegisterPharmacy },

  // Redirect to dashboard based on userType
  {
    path: '/dashboard',
    redirect: () => {
      const type = localStorage.getItem('userType');
      switch (type) {
        case 'doctor': return '/dashboard/doctor';
        case 'pharmacy': return '/dashboard/pharmacy';
        case 'hospital': return '/dashboard/hospital';
        case 'admin': return '/dashboard/admin';
        default: return '/dashboard/patient';
      }
    }
  },

  // Doctor Dashboard
  {
    path: '/dashboard/doctor',
    component: DashboardLayout,
    children: [
      { path: '', name: 'DoctorDashboard', component: DoctorDashboard },
      { path: 'patients', name: 'DoctorPatients', component: DoctorPatientsPage },
      { path: 'appointments', name: 'DoctorAppointments', component: DoctorAppointmentsPage },
      { path: 'prescriptions', name: 'DoctorPrescriptions', component: DoctorPrescriptionsPage },
    ]
  },

  // Patient Dashboard
  {
    path: '/dashboard/patient',
    component: DashboardLayout,
    children: [
      { path: '', name: 'PatientDashboard', component: PatientDashboard },
      { path: 'dependents', name: 'Dependents', component: DependentsPage },
      { path: 'upgrade-cover', name: 'UpgradeCover', component: UpgradeCover },
    ]
  },

  // Pharmacy Dashboard
  {
    path: '/dashboard/pharmacy',
    component: DashboardLayout,
    children: [
      { path: '', name: 'PharmacyDashboard', component: PharmacyDashboard },
    ]
  },

  // Hospital Dashboard
  {
    path: '/dashboard/hospital',
    component: DashboardLayout,
    children: [
      { path: '', name: 'HospitalDashboard', component: HospitalDashboard },
    ]
  },

  // Admin Dashboard (not using shared layout)
  { path: '/dashboard/admin', name: 'AdminDashboard', component: AdminDashboard },

  // Payment page
  { path: '/payment', name: 'Payment', component: MakePayment },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Protect private routes
router.beforeEach((to, from, next) => {
  const publicPages = ['/', '/login', '/admin/login', '/register/patient', '/register/doctor', '/register/hospital', '/register/pharmacy'];
  const isPublic = publicPages.includes(to.path);
  const isLoggedIn = !!localStorage.getItem('userRole');

  if (!isPublic && !isLoggedIn) {
    next('/');
  } else {
    next();
  }
});

export default router;
