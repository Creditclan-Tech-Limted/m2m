const state = {
    loading: 0,
};

const getters = {
    loading: state => state.loading,
};

const mutations = {
    START_LOADING: state => state.loading++,
    FINISH_LOADING: state => state.loading--,
};

const namespaced = true;

const loader = {
    namespaced,
    state,
    getters,
    mutations,
};

export default loader;
