<!-- @format -->

<template>
  <div id="parent" class="flex">
    <div class="song-details flex-1 flex">
      <img :src="albumLogo" class="img-container flex-2" />
      <div class="titles flex-5">
        <h5>{{ currentSong.title }}</h5>
        <p>{{ currentArtist }}</p>
      </div>
      <div class="flex other-btns flex-3 align-left">
        <button @click="like" class="love">
          <i
            :class="currentSong.liked ? `fas fa-heart liked` : `fas fa-heart`"
          ></i>
        </button>
      </div>
    </div>

    <div id="player" class="flex-2">
      <audio
        id="music-player"
        :src="currentSong.file"
        @ended="repeat ? loop : next"
      >
        <!--http://localhost:8000/media/musics/Sushant_KC_-_Gulabi_Official_Lyric_Video.mp3 -->
      </audio>
      <div class="flex control-btns align-center">
        <div class="control flex-5 align-right">
          <button
            id="shuffle"
            @click="shuffle = !shuffle"
            :class="shuffle ? 'side-btn focus' : 'side-btn'"
          >
            <i class="fas fa-random"></i>
          </button>
          <button class="next-previous" @click="prev" id="previous">
            <i class="fas fa-step-backward"></i>
          </button>
        </div>
        <div class="control flex-1">
          <button @click="playOrPause" id="play-or-pause">
            <i
              :class="
                played ? `fas fa-pause play-pause` : `fas fa-play play-pause`
              "
            ></i>
          </button>
        </div>
        <div class="control flex-5 align-left">
          <button class="next-previous" @click="next" id="next">
            <i class="fas fa-step-forward"></i>
          </button>
          <button
            id="repeat"
            @click="repeat = !repeat"
            :class="repeat ? 'side-btn focus' : 'side-btn'"
          >
            <i class="fas fa-redo"></i>
          </button>
        </div>
      </div>
      {{ currentTime }}
      <input
        type="range"
        id="change-time"
        @change="changeTime"
        step="0.1"
        min="0"
        max="100"
        value="0"
        style="width: 80%;"
      />
      {{ duration }}
    </div>

    <div class="volume-and-stuffs flex flex-1">
      <i class="fas fa-volume-up flex-2 align-right"></i>
      <input
        class="flex-1"
        type="range"
        id="change-vol"
        @change="changeVol"
        step="0.005"
        min="0"
        max="1"
        value="1"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Player",
  data() {
    return {
      // player: null,
      played: true,
      duration: "0:00",
      currentTime: "0:00",
      changingTime: false,
      playlist: {},
      index: 0,
      currentSong: {artistdetails: {title: null, id: null}},
      shuffle: false,
      repeat: false,
      albumLogo: "",
    };
  },
  computed: {
    currentArtist() {
      return this.currentSong.artistdetails.title
    }
  },
  props: ["type", "id", "songID"],
  async created() {
    this.starter();
    document.getElementById("change-time").value = 0;
  },
  mounted() {
    // just the first and basic things
    let player = document.getElementById("music-player");
    player.addEventListener("timeupdate", this.increaseSeek);
    player.controls = false;
    document.getElementById("change-time").value = 0;
    this.player = player;
    this.player.addEventListener("playing", this.increaseSeek);
    this.player.play();
  },
  methods: {
    // this gets the required song played
    async starter() {
      if (this.type === "liked") {
        await axios.get("http://localhost:8000/liked/").get(async (data) => {
          const songId = this.songID ? this.songID : data.data[this.index];
          let playlist = {
            title: "Liked Songs",
            songs: data.data,
            artistn: [],
          };
          data.data.forEach((song) => {
            playlist.artistn.push(song.artistdetails.title);
          });
          await axios
            .get(`http://localhost:8000/songs/${songId}`)
            .then((res) => {
              let song = res.data;
              this.duration = this.intoMinutes(song.length);
              this.currentSong = song;
              this.albumLogo = song.logo;
            });
        });
      } else {
        const url = this.type === "artists" ? `http://localhost:8000/${this.type}/${this.id}` : `http://localhost:8000/albums/${this.type}/${this.id}`
        await axios
          .get(url) // getting the details of the playlist
          .then(async (res) => {
            console.log("hello world")
            console.log(res.data.songs, res.data.songsinfo);
            this.playlist = res.data; // putting all the data into this variable
            let song = res.data.songsinfo.find(obj => obj.id == this.songID)
            console.log(this.playlist.songsinfo, song, 'info, song')
            this.currentSong = song;
            console.log('current', this.currentSong)
            console.log(song)
            this.duration = this.intoMinutes(song.length);
            this.albumLogo = song.logo;
            // this.duration, currentSong, albumLogo, playlist
          });
      } 
      setTimeout(() => {
        // this.player.pause()
        this.player.play(); // I have to do this because the audio tag won't load by the time this plays
      }, 1000);
    },

    async getSong(id) {
      if (this.type === "liked") {
        await axios.get("http://localhost:8000/liked/").get((data) => {
          const songId = this.songID ? this.songID : data.data[this.index];
          axios.get(`http://localhost:8000/songs/${songId}`).then((res) => {
            let song = res.data;
            this.duration = this.intoMinutes(song.length);
            this.currentSong = song;
            this.albumLogo = song.logo;
          });
        });
      } else {
        let song = this.playlist.songsinfo[this.index]
        console.log('getsong', song)
        // await axios
        //   .get(`http://localhost:8000/songs/${songId}`)
        //   .then(async (res1) => {
        //     let song = res1.data;
        //     song.artist = song.artistdetails.title
        //     this.currentSong = song;
        //     this.duration = this.intoMinutes(song.length);
        //     console.log("went through");
        //     const albumID = res1.data.album;
        //     this.albumLogo = song.logo
        //   });
        this.currentSong = song
        this.duration = this.intoMinutes(song.length)
        this.albumLogo = song.logo
      }
    },
    checkNavigator() {
      console.log("checked");
      console.log(Navigator);
      if ("mediaSession" in Navigator) {
        Navigator.mediaSession.metadata = new MediaMetadata({
          title: this.song.title,
          artist: this.song.artistdetails.title,
          album: this.song.album,
          artwork: this.albumLogo,
        });
      }
    },
    // this function converts the given secs into mins and secs

    intoMinutes(time) {
      let duration = Math.round(time); // rounding off the secs to the nearest value
      let minutes = duration > 60 ? Math.floor(duration / 60) : 0; // basic things to do to convert it into minutes and seconds
      let seconds = Math.round(duration % 60);
      return seconds > 9 ? `${minutes}:${seconds}` : `${minutes}:0${seconds}`; // just to make it look better e.g.: 1:05
    },
    playOrPause() {
      // this.player.load(); // this loads the element first in order to avoid the previous music to play
      const btn = document.getElementById("play-or-pause");
      const child = btn.firstChild;
      if (this.played) {
        this.player.pause();
      } else {
        this.player.play();
      }
      this.played = !this.played;
      this.checkNavigator();
    },
    changeVol() {
      this.player.volume = document.getElementById("change-vol").value;
    },
    changeTime() {
        this.player.pause();
        this.player.removeEventListener("timeupdate", this.updateSeek);
        this.player.currentTime = (this.player.duration / 100) * parseFloat(document.getElementById("change-time").value);
        this.currentTime = this.intoMinutes(this.player.currentTime);
        if (this.played) {
          this.player.play();
        }

      // this.player.pause();
      // this.player.removeEventListener("timeupdate", this.increaseSeek); // this removes the event listener because nothing worked
      // this.changingTime = true;
      // let duration = document.getElementById("change-time").value;
      // console.log(`${this.player.currentTime} before multiplying`);
      // this.player.currentTime = (duration / 100) * this.player.duration; // updating the time by converting it into percentage
      // // this.player.currentTime = duration * this.player.duration;
      // console.log(`${this.player.currentTime} after multiplying`);
      // this.currentTime = this.intoMinutes(this.player.currentTime); // converting the currenttime into minutes
      // if (this.played) {
      //   this.player.play(); // maintaining the status quo
      // }
      // this.player.addEventListener("timeupdate", this.increaseSeek);
      // this.changingTime = false;

      // music.currentTime = duration *
      // music.currentTime = duration * clickPercent(event)
    },
    // increaseSeek() {
    //   if (!this.changingTime) {
    //     let currentTime = this.player.currentTime;
    //     let seeker = document.getElementById("change-time");
    //     seeker.value = (currentTime / this.currentSong.length) * 100; // basic math to make the seek go ahead
    //     this.currentTime = this.intoMinutes(this.player.currentTime);
    //   }
    // },
    increaseSeek() {
      if (!this.changingTime && !this.player.paused) {
        let currentTime = this.player.currentTime;
        let seeker = document.getElementById("change-time");
        seeker.value = (currentTime / this.currentSong.length) * 100;
        this.currentTime = this.intoMinutes(this.player.currentTime);
      }
    },


    like() {
      console.log(this.id);
      this.currentSong.liked = !this.currentSong.liked;
      console.log(this.currentSong);
      axios.patch(`http://localhost:8000/songs/${this.currentSong.id}/`, {
        liked: this.currentSong.liked,
      });
    },

    async next() {
      this.player.pause();
      let songs = this.playlist.songsinfo;
      // resetting everything
      document.getElementById("change-time").value = 0;
      this.player.currentTime = 0;
      // conditional to check if it is in shuffle or if it is the last song in the list
      console.log(this.playlist.songs.length)
      if ((this.playlist.songsinfo.length === 1 || this.index + 1 === songs.length) && !this.shuffle) {
        this.index = 0;
      } else if (this.shuffle) {
        let index = this.index;
        while (this.index === index) {
          this.index = Math.floor(Math.random() * this.playlist.songsinfo.length);
        }
      } else {
        this.index++;
      }

      // getting the song
      console.log(this.playlist.songsinfo, this.index)
      this.getSong(this.playlist.songsinfo[this.index]);
      this.player.load();
      if (this.played) {
        setTimeout(() => {
          // this.player.pause()
          this.player.play(); // I have to do this because the audio tag won't load by the time this plays
        }, 2000);
      }
      navigator;
    },
    prev() {
      this.index =
        this.index === 0 ? this.playlist.songsinfo.length - 1 : this.index - 1;
      this.getSong(this.playlist.songsinfo[this.index]);
      this.player.load();
      if (this.played) {
        setTimeout(() => {
          // this.player.pause()
          this.player.play(); // I have to do this because the audio tag won't load by the time this plays
        }, 1000);
      }
    },
    loop: () => {
      this.player.loop = true;
      this.player.play();
    },
  },
  watch: {
    id: function(value) {
      console.log("changed");
      console.log(this.id);
      console.log(this);
      this.starter();
      setTimeout(() => {
        this.player.play();
      }, 1000);
      this.played = true;
    },
    songID: function(value) {
      console.log("changed");
      console.log(this.id);
      console.log(this);
      this.starter();
      setTimeout(() => {
        this.player.play();
      }, 1000);
      this.played = true;
    },
    type: function(value) {
      console.log("changed");
      console.log(this.id);
      console.log(this);
      this.starter();
      setTimeout(() => {
        this.player.play();
      }, 1000);
      this.played = true;
    },
    currentTime: function(value) {
      if (this.currentTime == this.duration) {
        console.log('checked')
        this.next()
      }
    }
  },
};
</script>

<style scoped>
.flex {
  align-items: center;
}

#parent {
  height: 9rem;
  width: 98vw;
  z-index: 10000;
  background: rgb(24, 24, 24);
}

button {
  cursor: auto;
  color: rgb(181, 181, 181);
}

button:hover {
  color: white;
}

.focus {
  color: #1db954;
}

.focus:hover {
  color: #21e666;
}

.fa,
.fas {
  -webkit-text-stroke: 0.7px black;
}

.fas:hover {
  -wekit-text-stroke: none;
}

#player {
  padding: 5px;
  box-sizing: border-box;
  text-align: center;
}

#shuffle i,
#repeat i {
  -webkit-text-stroke: 1px black;
  font-size: 1.3rem;
}

.songs {
  align-items: center;
}

h5,
p {
  margin-bottom: 0;
}

button {
  border: none;
}

.img-container {
  width: 65px;
  height: 65px;
  background: white;
}

.titles {
  margin-left: 1rem;
}

#play-or-pause {
  border-radius: 50%;
  padding: 0.6rem 1.1rem;
  background: white;
  transition: 0.02s;
  color: black;
}

#play-or-pause:hover {
  transform: scale(1.03);
}

.fa-play,
.fa-pause {
  -webkit-text-stroke: 0.8px white;
}

.control-btns {
  align-items: center;
}

.next-previous i {
  font-size: 1.7rem;
}

.side-btn {
  margin: 0 0.5em;
}

.fa-volume-up {
  font-size: 1.8rem;
}

.volume-and-stuffs input[type="range"] {
  width: 10%;
}

input[type="range"] {
  -webkit-appearance: none;
  margin: 10px 0;
}

input[type="range"]:focus {
  outline: none;
}

input[type="range"]::-webkit-slider-runnable-track {
  width: 100%;
  height: 5px;
  cursor: auto;
  transition: 0.1s;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: gray;
  border-radius: 25px;
  border: 0px solid #000101;
}

input[type="range"]::-webkit-slider-thumb {
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  border: 0px solid #000000;
  height: 12.5px;
  width: 12.5px;
  border-radius: 50%;
  background: white;
  cursor: auto;
  -webkit-appearance: none;
  margin-top: -3.6px;
}

input[type="range"]::-moz-range-track {
  width: 100%;
  height: 12.8px;
  cursor: auto;
  animate: 0.2s;
  box-shadow: 0px 0px 0px #000000, 0px 0px 0px #0d0d0d;
  background: #1db954;
  border-radius: 25px;
  border: 0px solid black;
}
</style>
