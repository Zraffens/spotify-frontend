<!-- @format -->

<template :key="key">
  <div id="playlist-container">
    <div class="head">
      <div class="flex">
        <div class="img-container">
          <img :src="playlist.logo" alt="" />
        </div>
        <div class="playlist-details">
          <p class="uppercase">{{ type.slice(0, type.length - 1) }}</p>
          <h1 class="extremely-large" @blur="editTitle" :contenteditable="editable">
            {{ playlist.title }}
          </h1>
          <p>
            With
            <span v-for="artist in artists.slice(0, 2) || []" :key="artist"
              >{{ artist }},
            </span>
            and many more
          </p>
          <p>
            <router-link to="/">Spotify</router-link> | 916 likes |
            {{ songs.length }} songs |
            {{ intoHours(totalLength) }}
          </p>
        </div>
      </div>
    </div>
    <div class="buttons">
      <button
        class="play"
        @click="$emit('playAudio', `${playlist.id}`, 'playlists')"
      >
        <i class="fas fa-play"></i>
      </button>
      <button @click="like" class="love">
        <i class="fas fa-heart fa-4x"></i>
      </button>
    </div>
    <table id="songs" rules="none">
      <thead>
        <tr>
          <th class="uppercase">#</th>
          <th class="uppercase">title</th>
          <th class="uppercase">album</th>
          <th class="uppercase"></th>
          <th class="uppercase">duration</th>
        </tr>
      </thead>
      <hr style="width: 1700%" />
      <tbody>
        <tr
          v-for="(song, index) in songs"
          :key="index"
          :id="`a${song.id}`"
          @mouseover="onHover(`${song.id}`)"
          @mouseleave="onLeave(`${song.id}`)"
        >
          <td style="width: 6%">
            <span class="index">{{ index + 1 }}</span>
            <button
              class="play-song"
              :id="`song${song.id}`"
              style="display: none"
              @click="
                $emit('playAudio', `${playlist.id}`, `${type}`, `${song.id}`)
              "
            >
              <i class="fas fa-play"></i>
            </button>
          </td>
          <td style="width: 30%">
            <p class="title">{{ song.title }}</p>
            <router-link to="/" class="artist">{{
              song.artistdetails.title
            }}</router-link>
          </td>
          <td class="album" style="width: 29%">
            <router-link
              v-if="route !== `/albums/albums/${id}`"
              @click="$options.created"
              :to="{ name: 'Album', params: { id: song.album.id } }"
              >{{ song.album.title }}</router-link
            >
            <router-link
              v-else
              :to="{ name: 'Album', params: { id: song.album.id } }"
              >{{ song.album.title }}</router-link
            >
          </td>
          <td class="like" style="width: 6%">
            <button
              @click="
                song.liked ? likeSong(song.id, true) : likeSong(song.id, false)
              "
              class="love"
            >
              <i :class="song.liked ? `fa liked fa-heart` : `fa fa-heart`"></i>
            </button>
          </td>
          <td class="duration" style="width: 29%">
            {{ intoMinutes(song.length) }}
          </td>
        </tr>
      </tbody>
    </table>
    <h4 v-if="editable" class="add">Add more songs</h4>
    <input
      type="text"
      name="keyword"
      id="search-keyword"
      @input="search"
      v-model="keyword"
      placeholder="Search for Songs"
    />

    <table id="songs" rules="none">
      <tbody>
        <tr v-for="(song, index) in results" :key="index">
          <td style="width: 33%">
            <p class="title">{{ song.title }}</p>
            <router-link to="/" class="artist">{{
              song.artistdetails.title
            }}</router-link>
          </td>
          <td class="album" style="width: 33%">
            <router-link
              v-if="route !== `/albums/albums/${id}`"
              @click="$options.created"
              :to="{ name: 'Album', params: { id: song.album.id } }"
              >{{ song.album.title }}</router-link
            >
            <router-link
              v-else
              :to="{ name: 'Album', params: { id: song.album.id } }"
              >{{ song.album.title }}</router-link
            >
          </td>
          <td style="width: 33%">
            <button @click="add(song)" class="add">Add</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";
import axiosInstance from "../axios";
import { mapGetters } from "vuex";

export default {
  name: "PlaylistComponent",
  data() {
    return {
      liked: false,
      id: this.$route.params.id,
      type: "",
      playlist: {},
      artists: [],
      songs: [],
      route: this.$route.path,
      key: 0,
      editable: false,
      focused: false,
      results: [],
    };
  },
  computed: {
    totalLength() {
      let sum = 0;
      this.songs.forEach((song) => {
        sum += song.length;
      });
      return sum;
    },
    ...mapGetters(["getUsername"]),
  },
  async created() {
    this.id = this.$route.params.id;
    if (this.$route.path === `/playlists/${this.id}`) {
      this.type = "playlists";
      let url = `http://localhost:8000/albums/playlists/${this.id}`;
      await axiosInstance.get(url).then((res) => {
        this.playlist = res.data;
        // this will push the names of the artists in the artists variable
        this.artists = res.data.artistn;
        // this will push the list of songs available for the given playlist
        this.songs = res.data.songsinfo;
        if (this.getUsername == res.data.username) {
          this.editable = true;
        }
      });
    } else if (this.$route.path === `/artists/${this.id}`) {
      this.type = "artists";
      let url = `http://localhost:8000/artists/${this.id}`;
      this.type = "artists";
      await axiosInstance.get(url).then(async (res) => {
        this.playlist = res.data;
        this.songs = res.data.songsinfo;
      });
    } else {
      this.type = "albums";
      let url = `http://localhost:8000/albums/albums/${this.id}`;
      await axiosInstance.get(url).then((res) => {
        console.log("songinfo", res.data.songsinfo);
        this.playlist = res.data;
        this.songs = res.data.songsinfo;
      });
    }
  },
  methods: {
    async allTheFuckingWork() {
      return "a";
    },
    intoHours(time) {
      let duration = Math.round(time); // rounding off the secs to the nearest value
      let hours = 0;
      let minutes1 = duration > 60 ? Math.floor(duration / 60) : 0; // basic things to do to convert it into hours and minutes
      if (minutes1 > 60) {
        hours = Math.floor(minutes1 / 60);
        let minutes = minutes1 % 60;
        return `${hours} hours ${minutes} minutes`;
      }
      return `${hours} hours ${minutes1} minutes`; // just to make it look better e.g.: 1:05
    },
    intoMinutes(time) {
      let duration = Math.round(time); // rounding off the secs to the nearest value
      let minutes = duration > 60 ? Math.floor(duration / 60) : 0; // basic things to do to convert it into minutes and seconds
      let seconds = Math.round(duration % 60);
      return seconds > 9 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`; // just to make it look better e.g.: 1:05
    },

    // it changes the color of the like button when it is pressed
    like() {
      if (!this.liked) {
        document.querySelector(".love").style.color = "#1db954";
        this.liked = true;
      } else {
        document.querySelector(".love").style.color = "white";
        this.liked = false;
      }
    },
    likeSong(id, likedSong) {
      console.log(id);
      let song;
      this.songs.forEach((item) => {
        if (item.id === id) {
          song = item;
        }
      });
      song.liked = !song.liked;
      axiosInstance.patch(`http://localhost:8000/songs/${id}/`, {
        liked: song.liked,
      });
    },
    onHover(id) {
      const index = document.querySelector(`#a${id} .index`);
      index.style.display = "none";
      const button = document.querySelector(`#a${id} button`);
      button.style.display = "inline-block";
    },
    onLeave(id) {
      const index = document.querySelector(`#a${id} .index`);
      index.style.display = "inline-block";
      const button = document.querySelector(`#a${id} button`);
      button.style.display = "none";
    },
    playing(id) {
      document.querySelector(`#${id} .title`).style.color = "#1db954";
      document.querySelector(`#${id} .play-song`).innerHTML =
        '<i style="color: #1db954;" class="fas fa-pause"></i>';
    },
    async search() {
      if (this.keyword) {
        await axiosInstance
          .get(`http://localhost:8000/songs/filter/${this.keyword}`)
          .then((res) => {
            this.results = res.data.slice(0, 10);
          });
        console.log(this.results);
      }
    },
    async add(song) {
      const songs = this.songs.map(obj => obj.id)
      this.songs.push(song)
      songs.push(song.id)
      console.log(songs)
      await axiosInstance
          .patch(`http://localhost:8000/albums/playlists/${this.id}`, {songs: songs})
          .then((res) => {
            console.log(res.data);
          });
    },
    async editTitle() {
      const title = document.querySelector("h1.extremely-large").innerText
      await axiosInstance
          .patch(`http://localhost:8000/albums/playlists/${this.id}`, {title: title})
          .then((res) => {
            console.log(res.data);
          });
    }
  },

  watch: {
    async $route(to, from) {
      if (to.name == "Album" || to.name == "Playlist") {
        this.songs = [];
        this.playlist = {};
        this.artists = [];
        this.id = this.$route.params.id;
        if (this.$route.path === `/playlists/${this.id}`) {
          let url = `http://localhost:8000/albums/playlists/${this.id}`;
          await axiosInstance.get(url).then((res) => {
            this.playlist = res.data;

            // this will push the names of the artists in the artists variable
            this.artists = res.data.artistn;
            // this will push the list of songs available for the given playlist
            this.songs = res.data.songsinfo;
          });
        } else {
          let url = `http://localhost:8000/albums/albums/${this.id}`;
          await axiosInstance.get(url).then((res) => {
            console.log("songinfo", res.data.songsinfo);
            this.playlist = res.data;
            this.songs = res.data.songsinfo;
          });
        }
      }
    },
  },
};
</script>

<style scoped>
p {
  margin: 0.1rem;
  font-weight: 600;
  font-size: 1.4rem;
}

#playlist-container {
  margin: 6.1em 1em 0 0;
}

.img-container {
  width: 25%;
}

.head .flex {
  align-items: flex-end;
  padding-bottom: 1rem;
}

.playlist-details {
  margin-left: 2rem;
}

.extremely-large {
  margin: -0.2rem 0 0.2rem 0;
}

.buttons {
  padding-top: 2rem;
}

.buttons button {
  margin: 0 1rem;
}

.play {
  font-size: 2rem;
}

.buttons .love {
  font-size: 0.8rem;
}

.fa-play {
  /* font-size: 3rem; */
  padding: 0.2rem;
}

#songs {
  width: 100%;
  /* text-align: center; */
  margin: 2rem 1rem;
}

.album, .duration, .like {
  text-align: center;
}

#songs hr {
  width: 100%;
}

#songs tbody tr:hover {
  background: rgb(39, 39, 39);
}

#songs .title {
  font-size: 1.5rem;
}

#songs .artist {
  font-size: 1.3rem;
}

#songs .love {
  font-size: 0.5rem;
}

.play-song {
  border: none;
  cursor: auto;
}

#search-keyword {
  background: white;
  border-radius: 5px;
  border: 1px solid white;
  font-size: 1.2rem;
  color: rgb(1, 1, 1);
  padding: 0.5em;
  /* width: 80%; */
}
</style>
