<template>
  <!-- Navigation Bar -->
    <header class="navbar">
    <img src="/LOGO BG.png" alt="LifeLine Logo" class="logo" />

    <nav>
      <ul class="nav-links">
        <li><router-link to="/">Home</router-link></li>
        <li><a href="#about">About</a></li>
        <li><a href="#services">Services</a></li>

        <!-- Register Dropdown -->
        <li class="dropdown">
          <a href="#register">Register ▾</a>
          <ul class="dropdown-content">
            <li><router-link to="/register/patient">Patient</router-link></li>
            <li><router-link to="/register/doctor">Doctor</router-link></li>
            <li><router-link to="/register/pharmacy">Pharmacy</router-link></li>
            <li><router-link to="/register/hospital">Hospital</router-link></li>
          </ul>
        </li>

        <!-- Login Dropdown -->
        <li class="dropdown">
          <a href="#login">Login ▾</a>
          <ul class="dropdown-content">
            <li><router-link to="/login">Login</router-link></li>
            <li><router-link to="/dashboard">Admin Only</router-link></li>
          </ul>
        </li>
      </ul>
    </nav>

    <router-link class="cta" to="/register/patient">Get Started</router-link>
  </header>

    <!-- Vue Router Navigation 
    <header class="app-header">
      <h1>Health App</h1>
      <nav>
        <router-link to="/login">Login</router-link> |
        <router-link to="/register/patient">Patient</router-link> |
        <router-link to="/register/doctor">Doctor</router-link> |
        <router-link to="/register/hospital">Hospital</router-link> |
        <router-link to="/register/pharmacy">Pharmacy</router-link> |
        <router-link to="/dashboard">Admin</router-link>
      </nav>
    </header> -->

  <div id="home">
    <router-view />
  </div>

   <!-- Footer -->
    <footer>
      <p>&copy; 2025 LifeLine. All rights reserved.</p>
      <ul>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Legal</a></li>
      </ul>
    </footer>
</template>