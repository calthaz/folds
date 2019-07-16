import { collectionService, userService } from '../services/index';

const state = {
    status:{ 
        loading: false,
        updating:false,
        dirty: false},
    all: []
};

const actions = {
    getAll({ commit }) {
        commit('getAllRequest');
        userService.getAllCollectionNames().then(nameList=> {
            for (let name of nameList){
                //console.log(userService.getUsername(), name)
                collectionService.getByUserAndName(userService.getUsername(), name)
                .then(
                    collection => commit('addToCollections', collection),
                    error => commit('addFailure', error)
                );
            }
        }).then(()=>{
            commit('getAllFinished');
        })
    },
    update({ dispatch, commit }, collection){
        commit('updateRequest');
        return collectionService.update(collection)
        .then(
            collection => {
                commit('updateSuccess');
                //dispatch('account/update')
                //router.push('/login');
                commit('setClean');
                dispatch('alert/success', 'Update collection successful.', { root: true });
                return new Promise(function(resolve, reject) {
                    resolve(collection);
                });
            },
            error => {
                commit('updateFailure', error);
                dispatch('alert/error', error, { root: true });
            }
        );
    },
    updateBg({ dispatch, commit }, {id, prevPath, formData}) {
        commit('updateRequest');
        //console.log('collection module');
        return collectionService.updateBg(id, prevPath, formData)
            .then(
                imagePath => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Update Background Image successful.', { root: true });

                    commit('updateCollectionBg', {id, imagePath:imagePath.path});
                    //commit('setDirty');
                    return new Promise(function(resolve, reject) {
                        resolve(imagePath);
                    });
                },
                error => {
                    commit('updateFailure', error);
                    dispatch('alert/error', error, { root: true });
                    return Promise.reject(error);
                }
            );
    },
};

const mutations = {
    getAllRequest(state) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
        state.status.loading = true;
        state.all=[];
    },
    getAllFinished(state) {
        state.status.loading = false;
    },
    addToCollections(state, collection) {
        state.all.push(collection);
    },
    addFailure(state, error) {
        state.status.error = error;
    },
    updateRequest(state){
        //Object.keys(state.status).forEach(v => state.status[v] = false);
        //state.status.loggedIn = true;
        state.status.updating = true;
    },
    updateSuccess(state, user) {
        //Object.keys(state.status).forEach(v => state.status[v] = false);
        state.status.updating = false;
        //state.status.loggedIn = true;
        //state.user = JSON.parse(localStorage.getItem('user'));
    },
    updateFailure(state, error) {
        //Object.keys(state.status).forEach(v => state.status[v] = false);
        state.status.updating = false;
        //state.status.loggedIn = true;
    },
    setDirty(state){
        console.log("collection dirty");
        state.status.dirty = true;
    },
    setClean(state){
        console.log("collection clean");
        state.status.dirty = false;
    },
    updateCollectionBg(state, info){
        for (let collection of state.all){
            if(collection._id===info.id){
                collection.bg = info.imagePath;
                break;
            }
        }
    }
};

export const collections = {
    namespaced: true,
    state,
    actions,
    mutations
};
