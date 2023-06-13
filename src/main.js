import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store'

const app = createApp(App);

// Register Vue Router
app.use(router);

// Register Vuex store
app.use(store);

app.mount("#app");
