<template>
  <header class="navbar">
    <img src="/LOGO BG.png" alt="LifeLine Logo" class="logo" />

    <nav>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>
        <li v-if="isLoggedIn">
          <router-link :to="dashboardRoute">Dashboard</router-link>
        </li>
        <li v-if="!isLoggedIn" class="dropdown">
          <a href="#register">Register ▾</a>
          <ul class="dropdown-content">
            <li><router-link to="/register/patient">Patient</router-link></li>
            <li><router-link to="/register/doctor">Doctor</router-link></li>
            <li><router-link to="/register/pharmacy">Pharmacy</router-link></li>
            <li><router-link to="/register/hospital">Hospital</router-link></li>
          </ul>
        </li>

        <li v-if="!isLoggedIn" class="dropdown">
          <a href="#login">Login ▾</a>
          <ul class="dropdown-content">
            <li><router-link to="/login">Login</router-link></li>
            <li><router-link to="/dashboard">Admin Only</router-link></li>
          </ul>
        </li>
      </ul>
    </nav>

    <header class="topbar" v-if="isLoggedIn">
      <div class="menu-toggle">&#9776;</div>
      <div class="profile-dropdown" ref="dropdown" :class="{ open: dropdownOpen }">
        <button class="profile-btn" @click="toggleDropdown" id="profileButton">
          <img :src="profileImage" alt="User Avatar" />
          {{ user?.name || 'User' }}
          <svg width="12" height="7" viewBox="0 0 12 7" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L6 6L11 1" stroke="#374151" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div class="dropdown-menu" role="menu" aria-labelledby="profileButton">
          <a href="#" role="menuitem">My Profile</a>
          <a class="cta" @click="logout">Logout</a>
        </div>
      </div>
    </header>

    <router-link v-if="!isLoggedIn" class="cta" to="/register/patient">Get Started</router-link>
    <button v-else class="cta" @click="logout">Logout</button>
  </header>

  <div id="home">
    <router-view />
  </div>

  <footer>
    <p>&copy; 2025 LifeLine. All rights reserved.</p>
    <ul>
      <li><a href="#">Contact</a></li>
      <li><a href="#">Privacy Policy</a></li>
      <li><a href="#">Legal</a></li>
    </ul>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      dropdownOpen: false
    };
  },
  computed: {
    user() {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    },
    dashboardRoute() {
  if (!this.user || !this.user.role) return '/';
  return `/dashboard/${this.user.role}`;
  },
    profileImage() {
      if (!this.user) return 'https://randomuser.me/api/portraits/lego/1.jpg';
      if (this.user.profileImage) return this.user.profileImage;

      const gender = this.user.gender?.toLowerCase();
      if (gender === 'female') {
        return 'https://randomuser.me/api/portraits/women/44.jpg';
      } else if (gender === 'male') {
        return 'https://randomuser.me/api/portraits/men/44.jpg';
      }
      return 'https://randomuser.me/api/portraits/lego/1.jpg';
    }
  },
  created() {
    this.updateLoginStatus();
    window.addEventListener('user-logged-in', this.updateLoginStatus);
    window.addEventListener('user-logged-out', this.updateLoginStatus);
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    window.removeEventListener('user-logged-in', this.updateLoginStatus);
    window.removeEventListener('user-logged-out', this.updateLoginStatus);
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    updateLoginStatus() {
      this.isLoggedIn = !!localStorage.getItem('user');
    },
    logout() {
      localStorage.clear();
      this.isLoggedIn = false;
      window.dispatchEvent(new Event('user-logged-out'));
      this.$router.push('/');
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    handleOutsideClick(event) {
      const dropdown = this.$refs.dropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.dropdownOpen = false;
      }
    }
  }
};
</script>




<style>
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
  background: skyblue;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  border-radius: 6px;
  overflow: hidden;
  display: none;
  min-width: 140px;
  z-index: 10;
}
.topbar .dropdown-menu a {
  display: block;
  padding: 10px;
  color: #374151;
  font-weight: 700;
  text-decoration: none;
}
.topbar .dropdown-menu a:hover {
  background-color: #e0e7ff;
  color: #1e40af;
}
.topbar .profile-dropdown.open .dropdown-menu {
  display: block;
}
</style>


