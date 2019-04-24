/* global Vue */
import Router from 'vue-router';
Vue.use(Router);

// import icons used for menu items
import 'vue-awesome/icons/tachometer-alt.js';
import Icon from 'vue-awesome/components/Icon';
Vue.component('icon', Icon);

import Dashboard from '../pages/Dashboard';

export default new Router({
  mode: 'history',
  routes: [
    {
      meta: {
        title: 'Dashboard',
      },
      name: 'dashboard',
      path: '/dashboard',
      component: Dashboard,
      sidebar: true,
      icon: 'tachometer-alt',
    },

    { path: '/*', redirect: '/dashboard' } // redirect to dashboard
  ],
});

