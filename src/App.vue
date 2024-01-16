<!-- @format -->

<template>
  <div id="app">
    <div class="flex" id="main-app">
      <div class="nav">
        <Navbar />
      </div>
      <main id="main" :style="playing ? 'margin-bottom: 10rem;' : ''">
        <TopBarWithSearch
          v-if="search"
          @search="searchFunc"
          @playAudio="playAudio"
        />
        <TopBar v-else />
        <router-view
          class="view"
          @search="loadSearchBar"
          @playAudio="playAudio"
        />
      </main>
    </div>
    <div id="player1">
      <Player
        :class="{ hidden: !playing }"
        :type="type"
        :id="id"
        :songID="songID !== 0 ? songID : 1"
      />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import TopBar from "./components/TopBar.vue";
import TopBarWithSearch from "./components/TopBarWithSearch.vue";
import Player from "./components/Player.vue";
import { mapActions } from "vuex";
import axiosInstance from "./axios";

export default {
  name: "App",
  components: {
    Navbar,
    TopBar,
    TopBarWithSearch,
    Player,
  },
  data() {
    return {
      search: false,
      playing: false,
      id: 0,
      type: "",
      songID: 0,
    };
  },
  async created() {
    await axiosInstance
      .get("http://localhost:8000/users/profile/")
      .then((res) => {
        this.login({
          username: res.data.username,
          id: res.data.id,
          liked: res.data.likedDetails,
        });
      });
  },
  methods: {
    loadSearchBar() {
      this.search = true;
    },
    async playAudio(id, type, songID) {
      this.playing = true;
      this.id = id;
      this.songID = songID ? songID : 0;
      this.type = type;
      const player = document.querySelector("#player1 audio");
      console.log("playerapp", player);
      player.load();
      console.log(songID);
    },
    searchFunc(keyword) {
      this.$router.push({ query: { kw: keyword } });
    },
    ...mapActions(["login"]),
  },
  watch: {
    // this makes the search bar visible when the user goes to the search page
    $route(to, from) {
      console.log(to);
      if (to.name !== "Search") {
        this.search = false;
      }
      console.log(this.search);
    },
  },
};
</script>

<style>
@import "./assets/main.css";
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: rgb(179, 179, 179);
}
.flex .nav {
  flex: 1;
  background: black;
}

.flex main {
  flex: 4;
  margin-bottom: 5rem;
}
.hidden {
  display: none;
}

.view {
  margin-top: 7rem;
}

#player1 {
  position: fixed;
  bottom: 0.1%;
  z-index: 99;
}
</style>
