import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/playlists/:id",
    name: "Playlist",
    component: () =>
      import(/* webpackChunkName: "Playlist" */ "../views/Playlist.vue"),
  },
  {
    path: "/albums/:id",
    name: "Album",
    component: () =>
      import(/* webpackChunkName: "Playlist" */ "../views/Playlist.vue"),
  },
  {
    path: "/artists/:id",
    name: "Artist",
    component: () =>
      import(/* webpackChunkName: "Playlist" */ "../views/Playlist.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () =>
      import(/* webpackChunkName: "Search" */ "../views/Search.vue"),
  },
  {
    path: "/search/:keyword",
    name: "SearchWithKeyword",
    component: () =>
      import(/* webpackChunkName: "Search" */ "../views/Search.vue"),
  },
  {
    path: "/liked",
    name: "Liked",
    component: () =>
      import(/* webpackChunkName: "Playlist" */ "../views/Playlist.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => 
      import("../views/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => 
      import("../views/Register.vue")
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
