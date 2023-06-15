<template>
  <div class="login-page">
    <div class="logo">
      <img src="logo.png" alt="Spotify Logo" />
    </div>
    <h1 class="login-heading">Log in to Spotify</h1>
    <form @submit="submit">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="email"
          v-model="username"
          placeholder="Enter your username"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" class="login-button">Log In</button>
    </form>
    <div v-if="loginError" class="error-message">
      Invalid username or password.
    </div>
    <div class="signup-link">
      Don't have an account? <a href="#">Sign up</a>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../axios";
import { mapActions } from 'vuex';
import router from "@/router";
export default {
  name: 'LoginPage',
  data() {
    return {
      username: "",
      password: "",
      registered: false,
      loginError: false
    };
  },
  methods: {
    submit(e) {
      e.preventDefault();

      axiosInstance
        .post("/token/", {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          localStorage.setItem("access_token", res.data.access);
          localStorage.setItem("refresh_token", res.data.refresh);
          localStorage.setItem("loggedIn", true);
          this.login({ username: this.username, id: res.data.id, liked: res.data.likedDetails })
          axiosInstance.defaults.headers = {
            Authorization: "JWT " + localStorage.getItem("access_token"),
          };
          // this.createdFunc({ details: userInfo });
          console.log(res);
          router.push({name: 'Home'})
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            this.loginError = true;
          }
        });;
    },
    ...mapActions(['login']),
  }
}
</script>

<style>
.login-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
}

.logo {
  margin-bottom: 2rem;
}

.logo img {
  width: 150px;
  height: auto;
}

.login-heading {
  font-size: 4.5rem;
  margin-bottom: 2rem;
}

form {
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-size: 1.4rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

input {
  width: 96%;
  padding: 0.75rem;
  font-size: 1.4rem;
  border-radius: 15px;
  border: 1px solid #ccc;
}

.login-button {
  width: 100%;
  padding: 1.4rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  background-color: #1db954;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #1ed760;
}

.signup-link {
  margin-top: 1rem;
  font-size: 1.2rem;
}

.signup-link a {
  color: #1db954;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}
</style>
