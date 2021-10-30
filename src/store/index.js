import { createStore } from 'vuex';

export default createStore({
    state: {
        loginToken: '',
        loggedIn: false,
        userData: {}
    },
    getters: {
        loginToken: (state) => state.loginToken,
        loggedIn: (state) => state.loggedIn,
        userData: (state) => state.userData
    },
    mutations: {
        SET_LOGGED_IN(state, loggedIn) {
            state.loggedIn = loggedIn;
        },
        SET_USER(state, user) {
            state.userData = user;
        },
        SET_MATERIALS(state, materials) {
            state.userData.materials = materials;
        }
    },
    actions: {
        SET_LOGGED_IN({commit}, loggedIn) {
            commit('SET_LOGGED_IN', loggedIn);
        },
        SET_USER({commit}, user) {
            commit('SET_USER', user);
        },
        LOG_OUT({commit}) {
            commit('SET_LOGGED_IN', false);
            commit('SET_USER', {});
        },
        SET_MATERIALS({commit}, materials) {
            commit('SET_MATERIALS', materials);
        }
    }
});