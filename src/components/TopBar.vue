<!-- @format -->

<template>
  <div class="grid grid-3-1 topbar">
    <div id="left-right" class="flex">
      <button
        class="button"
        @click="hasHistory() ? $router.go(-1) : $router.push('/')"
      >
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
        class="button"
        @click="hasHistory() ? $router.go(1) : $router.push('/')"
      >
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>
    <div v-if="isLoggedIn" class="grid other-btns">
      <div>
        <button id="upgrade" class="button flex-1">Upgrade</button>
      </div>
      <div class="align-right">
        <button id="user" class="button flex-1" @click="toggleMenu">{{ getUsername }}</button>
        <div v-if="showMenu" class="menu">
        <ul>
          <li @click="logout">Logout</li>
        </ul>
        </div>
      </div>
    </div>
    <div v-else class="grid other-btns">
      <div>
        <button id="upgrade" class="button flex-1"><router-link to="/login">Log In</router-link></button>
      </div>
      <div class="align-right">
        <button id="user" class="button flex-1"><router-link to="/register">Register</router-link></button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "TopBar",
  methods: {
    hasHistory() {
      return window.history.length > 2;
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    logout() {
      localStorage.clear();
      router.push("/login");
    },
  },
  data() {
    return {
      showMenu: false,
    }
  },
  computed: {
    ...mapGetters([
      'getUsername', 'isLoggedIn'
    ])
  }
};
</script>

<style>
#left-right button {
  font-size: 2rem;
  margin: 0.2em;
}

.other-btns button {
  background: black !important;
}

.other-btns {
  grid-template-columns: 1fr 1fr;
}

#upgrade {
  font-size: 1.1rem;
  padding: 0.8em 2.5em;
  border-radius: 1.7em;
}

#upgrade:hover {
  transform: scale(1.04);
}

#user {
  padding: 0.4em;
  font-size: 1.3rem;
}

#user:hover {
  background: rgb(46, 46, 46);
}

#user {
  background: rgb(255, 255, 255, 0.2);
}

.user-menu {
  position: relative;
  display: inline-block;
}

.menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1;
  background-color: #272727;
  color: white;
  border-radius: 4px;
  padding: 0.5rem;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}

.menu ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.menu li {
  padding: 0.5rem;
  cursor: pointer;
  color: white;
  transition: background-color 0.3s ease;
}

.menu li:hover {
  background-color: rgb(29, 29, 29);
  color: white;
}

</style>
