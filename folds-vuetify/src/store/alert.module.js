const state = {
    type: null,
    message: null,
    exists: false
};

const actions = {
    success({ commit }, message) {
        commit('success', message);
    },
    error({ commit }, error) {
        console.log('break point');
        if(error.isAxiosError){
            commit('error', error.response.data.message)
        }else{
            commit('error', error);
        }
    },
    clear({ commit }, message) {
        commit('clear', message);
    }
};

const mutations = {
    success(state, message) {
        state.type = 'success';
        state.exists = true;
        state.message = message;
    },
    error(state, message) {
        state.type = 'error';
        state.exists = true;
        state.message = message;
    },
    clear(state) {
        state.type = null;
        state.exists = false;
        state.message = null;
    }
};

export const alert = {
    namespaced: true,
    state,
    actions,
    mutations
};
