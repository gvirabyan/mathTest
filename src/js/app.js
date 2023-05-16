// Import Vue
import { createApp } from "vue";
import { createPinia } from "pinia";
import Vue3Sanitize from "vue-3-sanitize";

// Import Framework7
import Framework7 from "framework7/lite-bundle";

// Import Framework7-Vue Plugin
import Framework7Vue, { registerComponents } from "framework7-vue/bundle";

// Import Framework7 Styles
import "framework7/css/bundle";

// Import Icons and App Custom Styles
import "../css/app.scss";

// Import App Component
import App from "../components/app.vue";
import resetStore from "@/js/stores/plugins/reset-store";
import MathJax, { initMathJax, renderByMathjax } from "mathjax-vue3";

// Init Framework7-Vue Plugin
Framework7.use(Framework7Vue);

//language
import i18n from "./i18n";

// Init App
const app = createApp(App);
const pinia = createPinia();
pinia.use(resetStore);

// Register Framework7 Vue components
registerComponents(app);

function onMathJaxReady() {
  const el = document.getElementById("elementId");
  renderByMathjax(el);
}

// TODO: Change the url with the code from https://unpkg.com/mathjax@3.2.0/es5/tex-svg.js , maybe
initMathJax({ url: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.0.5/es5/tex-svg.js" }, onMathJaxReady);
// Mount the app
app.use(pinia);
app.use(i18n);
app.use(MathJax);
app.use(Vue3Sanitize);
app.mount("#app");

export default app;
