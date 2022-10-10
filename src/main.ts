import { createApp } from "vue";
import App from "./App.vue";

import "./assets/styles.css";

new Worker(new URL('workers/lox-rs.js', import.meta.url))

createApp(App).mount("#app");
