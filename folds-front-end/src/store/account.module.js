import { userService } from '../services/index';
import { router } from '../router';

const user = JSON.parse(localStorage.getItem('user'));
const state = user
    ? { status: { loggedIn: true }, user }
    : { status: {}, user: null };

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
    updateAvatar({ dispatch, commit }, {id, formData}) {
        commit('updateRequest');
        //console.log('account module');
        return userService.updateAvatar(id, formData)
            .then(
                image => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Update successful.', { root: true });
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
                    dispatch('alert/success', 'Update successful.', { root: true });
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
        console.log('account module');
        return userService.deleteCollection(collectionId)
            .then(
                collections => {
                    commit('updateSuccess');
                    //router.push('/login');
                    dispatch('alert/success', 'Update successful.', { root: true });
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
};

const mutations = {
    loginRequest(state, user) {
        state.status = { loggingIn: true };
        state.user = user;
    },
    loginSuccess(state, user) {
        state.status = { loggedIn: true };
        state.user = user;
    },
    loginFailure(state) {
        state.status = {};
        state.user = null;
    },
    logout(state) {
        state.status = {};
        state.user = null;
    },
    registerRequest(state, user) {
        state.status = { registering: true };
    },
    registerSuccess(state, user) {
        state.status = {};
    },
    registerFailure(state, error) {
        state.status = {};
    },
    updateRequest(state){
        state.status = {updating: true};
    },
    updateSuccess(state, user) {
        state.status = {};
        state.user = JSON.parse(localStorage.getItem('user'));
    },
    updateFailure(state, error) {
        state.status = {};
    },
};

export const account = {
    namespaced: true,
    state,
    actions,
    mutations
};