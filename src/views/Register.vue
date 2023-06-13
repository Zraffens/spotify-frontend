<template>
  <div class="register-page">
    <div class="logo">
      <img src="logo.png" alt="Spotify Logo" />
    </div>
    <h1 class="register-heading">Create your Spotify Account</h1>
    <form>
      <div class="form-group">
        <label for="email">Email address</label>
        <input type="email" id="email" placeholder="Enter your email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" placeholder="Enter your password" />
      </div>
      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input type="password" id="confirm-password" placeholder="Confirm your password" />
      </div>
      <button class="register-button" @click="signup">Sign Up</button>
    </form>
    <div class="login-link">
      Already have an account? <router-link to="/login">Log in</router-link>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../axios";
import router from "@/router";
export default {
  name: 'RegisterPage',
  
}
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
</style>
