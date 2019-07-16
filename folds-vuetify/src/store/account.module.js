import { userService } from '../services/index';
import { router } from '../router';

const user = JSON.parse(localStorage.getItem('user'));
const state = user
    ? { status: { 
        loggingIn: false,
        loggedIn: true,
        registering: false,
        updating:false,
        dirty: false }, 
        user }
    : { status: {loggingIn: false}, user: null };

const actions = {
    login({ dispatch, commit }, { username, password }) {
        commit('loginRequest', { username });
    
        userService.login(username, password)
            .then(
                user => {
                    commit('loginSuccess', user);
                    router.push('/');
                },
                error => {
                    commit('loginFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    logout({ commit }) {
        userService.logout();
        commit('logout');
    },
    register({ dispatch, commit }, user) {
        commit('registerRequest', user);
    
        userService.register(user)
            .then(
                user => {
                    commit('registerSuccess', user);
                    router.push('/login');
                    setTimeout(() => {
                        // display success message after route change completes
                        dispatch('alert/success', 'Registration successful', { root: true });
                    })
                },
                error => {
                    //console.log("breakpoint");
                    commit('registerFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    update({ dispatch, commit }){
        commit('updateRequest');
        return userService.update(state.user)
        .then(
            user => {
                commit('updateSuccess');
                //router.push('/login');
                dispatch('alert/success', 'Update successful.', { root: true });
                commit('setClean');
                return new Promise(function(resolve, reject) {
                    resolve(user);
                });
            },
            error => {
                commit('updateFailure', error);
                dispatch('alert/error', error, { root: true });
            }
        );
    },
    updateAvatar({ dispatch, commit }, {id,  formData}) {
        commit('updateRequest');
        //console.log('account module');
        return userService.updateAvatar(id, formData)
            .then(
                image => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Update avatar successful.', { root: true });
                    return new Promise(function(resolve, reject) {
                        resolve(image);
                    });
                },
                error => {
                    commit('updateFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    addCollection({ dispatch, commit }, {id, collection}) {
        commit('updateRequest');
        //console.log('account module');
        return userService.addCollection(id, collection)
            .then(
                collections => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Add collection successful.', { root: true });
                    dispatch('collections/getAll', null, { root: true });
                    return new Promise(function(resolve, reject) {
                        resolve(collections);
                    });
                },
                error => {
                    commit('updateFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    deleteCollection({ dispatch, commit }, collectionId) {
        commit('updateRequest');
        //console.log('account module');
        return userService.deleteCollection(collectionId)
            .then(
                collections => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Delete collection successful.', { root: true });
                    dispatch('collections/getAll', null, { root: true });
                    return new Promise(function(resolve, reject) {
                        resolve(collections);
                    });
                },
                error => {
                    commit('updateFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    addBundle({ dispatch, commit }, {id, type, bundle}) {
        commit('updateRequest');
        //console.log('account module');
        return userService.addBundle(id, type, bundle)
            .then(
                bundles => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', `Add ${type} bundle successful.`, { root: true });
                    return new Promise(function(resolve, reject) {
                        resolve(bundles);
                    });
                },
                error => {
                    commit('updateFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
    deleteBundle({ dispatch, commit }, {type, id}) {
        commit('updateRequest');
        //console.log('account module');
        return userService.deleteBundle(type, id)
            .then(
                bundles => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Delete bundle successful.', { root: true });
                    return new Promise(function(resolve, reject) {
                        resolve(bundles);
                    });
                },
                error => {
                    commit('updateFailure', error);
                    dispatch('alert/error', error, { root: true });
                }
            );
    },
};

const mutations = {
    loginRequest(state, user) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
        state.status.loggingIn = true;
        state.user = user;
    },
    loginSuccess(state, user) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
        state.status.loggedIn = true;
        state.user = user;
    },
    loginFailure(state) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
        state.user = null;
    },
    logout(state) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
        state.user = null;
    },
    registerRequest(state, user) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
        state.status.registering = true;
    },
    registerSuccess(state, user) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
    },
    registerFailure(state, error) {
        Object.keys(state.status).forEach(v => state.status[v] = false);
    },
    setDirty(state){
        console.log('set dirty in account.module')
        state.status.dirty = true;
    },
    setClean(state){
        state.status.dirty = false;
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
        state.user = JSON.parse(localStorage.getItem('user'));
    },
    updateFailure(state, error) {
        //Object.keys(state.status).forEach(v => state.status[v] = false);
        state.status.updating = false;
        //state.status.loggedIn = true;
    },
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};