import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueCookies from 'vue-cookies';

const myApp = createApp(App);
myApp.use(router);
myApp.use(store);
myApp.use(VueCookies);
myApp.mount('#app');
