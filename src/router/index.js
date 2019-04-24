/* global Vue */
import Router from 'vue-router';
Vue.use(Router);

// import icons used for menu items
import 'vue-awesome/icons/tachometer-alt.js';
import Icon from 'vue-awesome/components/Icon';
Vue.component('icon', Icon);

import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import Spokes from '../pages/Spokes';
import Logs from '../pages/Logs';

export default new Router({
  mode: 'history',
  routes: [
    {
      meta: {
        title: 'Dashboard',
        icon: 'tachometer-alt',
        sidebar: true,
      },
      name: 'dashboard',
      path: '/dashboard',
      component: Dashboard,
    },
    {
      meta: {
        title: 'Events',
        icon: 'exchange-alt',
        sidebar: true,
      },
      name: 'events',
      path: '/events',
      component: Events,
    },
    {
      meta: {
        title: 'Spokes',
        icon: 'asterisk',
        sidebar: true,
      },
      name: 'spokes',
      path: '/spokes',
      component: Spokes,
    },
    {
      meta: {
        title: 'Logs',
        icon: 'th-list',
        sidebar: true,
      },
      name: 'logs',
      path: '/logs',
      component: Logs,
    },

    { path: '/*', redirect: '/dashboard' } // redirect to dashboard
  ],
});

