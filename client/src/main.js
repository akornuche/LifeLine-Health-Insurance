

import './assets/style.css';   // <-- your custom styles
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // if using Vue Router


createApp(App).use(router).mount('#app');