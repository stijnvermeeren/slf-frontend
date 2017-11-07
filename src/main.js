import Vue from 'vue'
import VueResource from 'vue-resource';

import KeenUI from 'keen-ui';
import 'keen-ui/dist/keen-ui.css';

import App from './App.vue'
import store from './store';

Vue.use(KeenUI);
Vue.use(VueResource);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
})