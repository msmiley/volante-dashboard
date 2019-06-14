/* global _, Vue, Vuex */
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: 'volante',
    version: '0.0.0',
    events: [],
    logEvents: [],
  },
  getters: {
    title(state) {
      return state.title;
    },
    version(state) {
      return state.version;
    },
    events(state) {
      return state.events;
    },
    logEvents(state) {
      return _.flatMap(state.logEvents, 'eventObj');
    },
  },
  actions: {
    setTitle({ commit }, title) {
      commit('setTitle', title);
    },
    setVersion({ commit }, version) {
      commit('setVersion', version);
    },
    addEvent({ commit }, eventArgs) {
      commit('addEvent', eventArgs);
    },
    clearEvents({ commit }) {
      commit('clearEvents');
    },
    clearLogEvents({ commit }) {
      commit('clearLogEvents');
    },
  },
  mutations: {
    setTitle(state, title) {
      state.title = title;
    },
    setVersion(state, version) {
      state.version = version;
    },
    addEvent(state, eventArgs) {
      let eventType = eventArgs[0];
      let eventObj = eventArgs[1];
      if (eventType === 'volante.log') {
        state.logEvents.push({
          ts: new Date(),
          eventType,
          eventObj,
        });
      } else {
        state.events.push({
          ts: new Date(),
          eventType,
          eventObj,
        });
      }
    },
    clearEvents(state) {
      state.events = [];
    },
    clearLogEvents(state) {
      state.logEvents = [];
    },
  },
});