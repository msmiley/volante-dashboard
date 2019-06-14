/* global Vue */
import Router from 'vue-router';
Vue.use(Router);

// import icons used for menu items
import 'vue-awesome/icons/tachometer-alt.js';
import Icon from 'vue-awesome/components/Icon';
Vue.component('icon', Icon);

import Dashboard from '../pages/Dashboard';
import Events from '../pages/Events';
import Topology from '../pages/Topology';
import Logs from '../pages/Logs';

export default new Router({
  base: '/dashboard',
  mode: 'history',
  routes: [
    // {
    //   meta: {
    //     title: 'Dashboard',
    //     icon: 'tachometer-alt',
    //     sidebar: true,
    //   },
    //   name: 'dashboard',
    //   path: '/dashboard',
    //   component: Dashboard,
    // },
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
    // {
    //   meta: {
    //     title: 'Topology',
    //     icon: 'asterisk',
    //     sidebar: true,
    //   },
    //   name: 'topology',
    //   path: '/topology',
    //   component: Topology,
    // },
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

    { path: '/*', redirect: '/events' } // redirect to dashboard
  ],
});

