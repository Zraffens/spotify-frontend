<template>
  <div class="register-page">
    <div class="logo">
      <img src="logo.png" alt="Spotify Logo" />
    </div>
    <h1 class="register-heading">Create your Spotify Account</h1>
    <form @submit.prevent="submit(e)">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          v-model="username"
          @change="usernameChange"
          name="username"
          :class="{ 'border-red': !username && usernameFieldTouched }"
          id="username"
          @input="usernameFieldTouched = true"
        />
      </div>
      <div class="form-group">
        <label for="email">Email address</label>
        <input
          type="email"
          :class="{ 'border-red': !email && emailFieldTouched }"
          v-model="email"
          name="email"
          id="email"
          @input="emailFieldTouched = true"
          placeholder="Enter your email"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          v-model="password"
          name="password"
          id="password"
          :class="{
            'border-red':
              (!password || password.length < 8) && passwordFieldTouched,
          }"
          @input="passwordFieldTouched = true"
          placeholder="Enter your password"
        />
      </div>
      <div class="form-group">
        <label for="verify">Confirm Password</label>
        <input
          type="password"
          v-model="verify"
          name="verify"
          id="verify"
          :class="{ 'border-red': !passwordsMatch }"
          placeholder="Confirm your password"
        />
      </div>
      <div v-if="!username && usernameFieldTouched" class="error-message">
        Username is required.
      </div>
      <div v-if="usernameExists" class="error-message">
        Username already exists.
      </div>
      <div v-if="!email && emailFieldTouched" class="error-message">
        Email is required.
      </div>
      <div v-if="!passwordsMatch" class="error-message">
        Passwords do not match.
      </div>
      <div
        v-if="(!password || password.length < 8) && passwordFieldTouched"
        class="error-message"
      >
        Password must be at least 8 characters long.
      </div>
      <button
        type="submit"
        class="register-button"
        :disabled="!submittable || !passwordsMatch"
        @click="signup"
      >
        Sign Up
      </button>
    </form>
    <div class="login-link">
      Already have an account? <router-link to="/login">Log in</router-link>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../axios";
import axios from "axios";
import router from "@/router";
export default {
  name: "RegisterPage",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      verify: "",
      emailFieldTouched: false,
      usernameFieldTouched: false,
      passwordFieldTouched: false,
      usernameExists: false,
    };
  },
  computed: {
    submittable() {
      const isEmailValid = this.email;
      const isUsernameValid = this.username;
      const isPasswordValid = this.password && this.password.length >= 8;
      axiosInstance;
      return (
        isEmailValid &&
        isUsernameValid &&
        isPasswordValid &&
        this.passwordsMatch
      );
    },
    passwordsMatch() {
      return !(this.password !== this.verify && this.password && this.verify);
    },
  },
  methods: {
    async submit(e) {
      const self = this;
      await axios
        .get("http://localhost:8000/users/")
        .then((res) => {
          this.usernameExists = false;
          console.log(res.data);
          res.data.forEach((i) => {
            if (i.username == this.username) {
              this.usernameExists = true;
              console.log("aaaaasdf");
              return;
            }
          });
        })
        .catch((err) => {
          console.log("aa", err);
        });
      console.log(this.submittable);
      if (this.submittable && !this.usernameExists) {
        await axios
          .post("http://localhost:8000/users/register/", {
            username: this.username,
            email: this.email,
            password: this.password,
          })
          .then(function (response) {
            console.log(response);
            self.$router.push({ path: "/login", query: { registered: true } });
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
  },
};
</script>

<style>
.register-page {
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

.register-heading {
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

.register-button {
  width: 100%;
  padding: 0.9rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  background-color: #1db954;
  border: none;
  border-radius: 15px;
  cursor: pointer;
}

.register-button:hover {
  background-color: #1ed760;
}

.login-link {
  margin-top: 1rem;
  font-size: 1.1rem;
}

.login-link a {
  color: #1db954;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
.border-red {
  border-color: red;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}
</style>
