import { createStore } from 'vuex';

const store = createStore({
  state: {
    loggedIn: false,
    username: '',
    id: null,
    liked: []
  },
  mutations: {
    updateLoginStatus(state, payload) {
      state.loggedIn = payload.loggedIn;
      state.username = payload.username;
      state.id = payload.id;
      state.liked = payload.liked
    },
    like(state, payload) {
      state.liked = [...state.liked, payload.song]
    },
    unlike(state, payload) {
      const liked = state.liked
      const newliked = liked.filter(obj => obj != payload.song)
      state.liked = newliked
    },

  },
  actions: {
    login({ commit }, { username, id, liked }) {
      // Perform login logic, such as making an API call
      // Once the login is successful, commit the mutation to update the state
      commit('updateLoginStatus', { loggedIn: true, username, id, liked });
    },
    logout({ commit }) {
      // Perform logout logic, such as clearing local storage or making an API call
      // Once the logout is successful, commit the mutation to update the state
      commit('updateLoginStatus', { loggedIn: false, username: '', id: null, liked: [] });
    },
    like({ commit }, { song }) {
      commit('like', { song })
    },
    unlike({ commit }, { song }) {
      commit('unlike', { song })
    } 
  },
  getters: {
    isLoggedIn(state) {
      return state.loggedIn;
    },
    getUsername(state) {
      return state.username;
    },
    getID(state) {
      return state.id
    },
    getLiked(state) {
      return state.liked
    }
  },
});

export default store;
