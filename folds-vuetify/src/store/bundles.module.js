import { bundleService, userService } from '../services/index';

const state = {
    status:{ 
        loading: false,
        updating:false,
        dirty: false},
    bundle: null
};

const actions = {
    getByTypeAndId({ commit }, {id, type}) {
        console.log('get current bundle');
        commit('getAllRequest');
        bundleService.getByTypeAndId(type, id).then(bundle=> {
            commit('getCurrentBundle', bundle);
        }).then(()=>{
            commit('getAllFinished');
        })
    },
    update({ dispatch, commit }, {type, bundle}){
        commit('updateRequest');
        return bundleService.update(type, bundle)
        .then(
            bundle => {
                commit('updateSuccess');
                //dispatch('account/update')
                //router.push('/login');
                commit('setClean');
                dispatch('alert/success', 'Update bundle successful.', { root: true });
                return new Promise(function(resolve, reject) {
                    resolve(bundle);
                });
            },
            error => {
                commit('updateFailure', error);
                dispatch('alert/error', error, { root: true });
            }
        );
    },
    updateImage({ dispatch, commit }, {id, prevPath, formData}) {
        commit('updateRequest');
        //console.log('bundle module');
        return bundleService.updateImage(id, prevPath, formData)
            .then(
                imagePath => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Update Image successful.', { root: true });

                    commit('updateBundleImage', {id, imagePath:imagePath.path});
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
        state.bundle = null;
    },
    getAllFinished(state) {
        state.status.loading = false;
    },
    getCurrentBundle(state, bundle) {
        state.bundle=bundle;
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
        console.log("bundle dirty");
        state.status.dirty = true;
    },
    setClean(state){
        console.log("bundle clean");
        state.status.dirty = false;
    },
    updateBundleImage(state, info){
        state.bundle.image = info.imagePath;  
    }
};

export const bundles = {
    namespaced: true,
    state,
    actions,
    mutations
};
