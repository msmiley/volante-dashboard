/* global _, Vue, Vuex */
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    events: [],
  },
  getters: {
    allEvents(state) {
      return state.events;
    },
    logEvents(state) {
      return _.flatMap(_.filter(state.events, { eventType: 'volante.log'}), 'eventObj');
    },
  },
  actions: {
    addEvent({ commit }, eventArgs) {
      commit('addEvent', eventArgs);
    }
  },
  mutations: {
    addEvent(state, eventArgs) {
      let eventType = eventArgs[0];
      let eventObj = eventArgs[1];
      state.events.push({
        ts: new Date(),
        eventType,
        eventObj,
      });
    }
  },
});