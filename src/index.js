/* global Vue */
import App from './App.vue';
import router from './router';
import store from './store';

import Vuestro from 'vuestro';
Vue.use(Vuestro);

// start socket io
import Socket from './socket';
Vue.use(Socket);

// disable production tip
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
});
