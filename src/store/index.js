/* global _, Vue, Vuex */
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: 'volante',
    version: '0.0.0',
    events: [],
    logEvents: [],
    stats: [],
    uptime: null,
    topology: [],
    topologyNodelist: {
      nodes: [
        {
          name: 'Volante Hub'
        }
      ],
      links: [],
    },
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
      return state.logEvents;
    },
    stats(state) {
      return state.stats;
    },
    uptime(state) {
      return state.uptime;
    },
    topology(state) {
      return state.topology;
    },
    topologyNodelist(state) {
      return state.topologyNodelist;
    },
    lastEvent(state) {
      return state.events[state.events.length-1];
    },
    errorLogs(state) {
      return _.filter(state.logEvents, function(o) {
        return o.eventObj[0].lvl === 'error';
      });
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
    setStats({ commit }, stats) {
      commit('setStats', stats);
    },
    setUptime({ commit }, uptime) {
      commit('setUptime', uptime);
    },
    setTopology({ commit }, topology) {
      commit('setTopology', topology);
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
      let eventObj = eventArgs.slice(1);
      if (eventType === 'volante.log' || eventType === 'error') {
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
    setStats(state, stats) {
      state.stats = stats;
    },
    setUptime(state, uptime) {
      state.uptime = uptime;
    },
    setTopology(state, topology) {
      state.topology = topology;
      state.topologyNodelist = {
        nodes: [
          {
            name: 'Volante Hub'
          }
        ],
        links: [],
      };
      let cnt = 1;
      for (let t of topology) {
        state.topologyNodelist.nodes.push(t);
        state.topologyNodelist.links.push({
          source: 0,
          target: cnt++,
        });
      }
    },
  },
});