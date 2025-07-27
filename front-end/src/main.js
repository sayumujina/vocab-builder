import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import "semantic-ui-css/semantic.css";
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
app.use(router);

// Replacement for vue 2 flash messages
app.use(Vue3Toastify, {
  autoClose: 3000,
  clearOnUrlChange: false,
  pauseOnHover: true,
});
app.mount('#app');
