import { collectionService, userService } from '../services/index';

const state = {
    status: null,
    all: []
};

const actions = {
    getAll({ commit }) {
        commit('getAllRequest');
        userService.getAllCollectionNames().then(nameList=> {
            for (let name of nameList){
                console.log(userService.getUsername(), name)
                collectionService.getByUserAndName(userService.getUsername(), name)
                .then(
                    collection => commit('addToCollections', collection),
                    error => commit('addFailure', error)
                );
            }
        })
    },
};

const mutations = {
    getAllRequest(state) {
        state.status = { loading: true };
        state.all=[];
    },
    addToCollections(state, collection) {
        state.status = { loading: false };
        state.all.push(collection);
    },
    addFailure(state, error) {
        state.status = { error };
    }
};

export const collections = {
    namespaced: true,
    state,
    actions,
    mutations
};
