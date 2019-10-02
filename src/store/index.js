/* global _, Vue, Vuex */
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    title: 'volante',
    version: '0.0.0',
    events: [],
    lastCallbackResult: null, // store result of callback for interactive eventing
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
        return o.eventArgs[0].lvl === 'error';
      });
    },
    lastCallbackResult(state) {
      return state.lastCallbackResult;
    },
    allHandledEvents(state) {
      let ret = [];
      for (let m of state.topology) {
        ret = ret.concat(m.handledEvents);
      }
      return _.uniq(ret);
    },
  },
  actions: {
    setTitle({ commit }, title) {
      commit('setTitle', title);
    },
    setVersion({ commit }, version) {
      commit('setVersion', version);
    },
    addEvent({ commit }, args) {
      commit('addEvent', args);
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
    setLastCallbackResult({ commit }, result) {
      commit('setLastCallbackResult', result);
    },
  },
  mutations: {
    setTitle(state, title) {
      state.title = title;
    },
    setVersion(state, version) {
      state.version = version;
    },
    addEvent(state, args) {
      let eventType = args[0]; // type is first arg, rest are the "args"
      let eventArgs = args.slice(1);
      if (eventType === 'volante.log' || eventType === 'error') {
        state.logEvents.push({
          ts: new Date(),
          eventType,
          eventArgs,
        });
      } else {
        state.events.push({
          ts: new Date(),
          eventType,
          eventArgs,
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
    setLastCallbackResult(state, result) {
      state.lastCallbackResult = {
        ts: new Date(),
        result,
      };
    },
  },
});