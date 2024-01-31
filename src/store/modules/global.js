import http from "../../plugins/http";

const state = {
  query: '',
  stores: [],
  prices: [],
  products: [],
};

const mutations = {
  set: (state, data) => {
    Object.keys(data).forEach(key => {
      state[key] = data[key];
    })
  },
};

const actions = {
  async prices({ commit }) {
    const res = await http.get('https://cc-eligibility-staging.herokuapp.com/misc/plans/bnpl');
    commit('set', { prices: res.data.data });
  },
  async resolveItemId(_, slug) {
    const { data: { data } } = await http.get(`/2/slug/${slug}`);
    return data;
  }
};

const global = {
  namespaced: true,
  state,
  getters: {},
  mutations,
  actions
};

export default global;
