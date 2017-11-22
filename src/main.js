import Vue from 'vue'

import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';
import VueAnalytics from 'vue-analytics'

import App from './App.vue'
import store from './store';

Vue.use(KeenUI);

Vue.use(VueAnalytics, {
  id: 'UA-89547746-2'
});

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});
