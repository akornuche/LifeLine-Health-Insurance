
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import RegisterPatient from '../views/RegisterPatient.vue';
import RegisterDoctor from '../views/RegisterDoctor.vue';
import RegisterHospital from '../views/RegisterHospital.vue';
import RegisterPharmacy from '../views/RegisterPharmacy.vue';
import Login from '../views/Login.vue';
import AdminDashboard from '../views/AdminDashboard.vue';

const routes = [
  {
  path: '/',
  name: 'Home',
  component: Home
  },
  { path: '/login', component: Login },
  { path: '/register/patient', component: RegisterPatient },
  { path: '/register/doctor', component: RegisterDoctor },
  { path: '/register/hospital', component: RegisterHospital },
  { path: '/register/pharmacy', component: RegisterPharmacy },
  { path: '/dashboard', component: AdminDashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
