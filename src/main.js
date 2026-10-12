import { createApp } from 'vue'
import VueGtag from "vue-gtag";

import App from './App.vue'
import store from './store';

const app = createApp(App);
app.use(store);
app.use(VueGtag, {
  config: { id: "UA-89547746-2" }
});
app.mount('#app');
