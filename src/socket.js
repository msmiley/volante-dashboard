/* global io */

import store from './store';

export default {
  install(Vue, options) {

    Vue.socket = io('', {
      path: '/socket.io',
    });

    Vue.socket.on('*', (...args) => {
      store.dispatch('addEvent', args);
    });

  }
};