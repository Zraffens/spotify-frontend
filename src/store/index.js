import { createStore } from 'vuex';

const store = createStore({
  state: {
    loggedIn: false,
    username: '',
  },
  mutations: {
    updateLoginStatus(state, payload) {
      state.loggedIn = payload.loggedIn;
      state.username = payload.username;
      state.password = payload.password;
    }
  },
  actions: {
    login({ commit }, { username, password }) {
      // Perform login logic, such as making an API call
      // Once the login is successful, commit the mutation to update the state
      commit('updateLoginStatus', { loggedIn: true, username, password });
    },
    logout({ commit }) {
      // Perform logout logic, such as clearing local storage or making an API call
      // Once the logout is successful, commit the mutation to update the state
      commit('updateLoginStatus', { loggedIn: false, username: '', password: '' });
    }
  },
  getters: {
    isLoggedIn(state) {
      return state.loggedIn;
    },
    getUsername(state) {
      return state.username;
    },
  },
});

export default store;
