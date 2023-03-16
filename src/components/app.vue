<template>
  <f7-app v-bind="f7params">
    <!-- Left panel with cover effect-->
    <f7-panel left cover dark>
      <f7-page>
        <f7-navbar title="Menu"></f7-navbar>

        <main-menu />
      </f7-page>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script setup>
import { onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";
import routes from "../js/routes.js";
import MainMenu from "./main-menu.vue";
import cordovaApp from "@/js/cordova-app";

const f7params = {
  name: "Math App", // App name
  theme: "auto", // Automatic theme detection
  routes: routes, // App routes
};

const addGmapsScript = () => {
  // dynamic adding of google map script on app creation
  const gmapsScriptId = "gm-script";
  const gmapsScriptIsAdded = !!document.getElementById(gmapsScriptId);
  const gmapsScript = document.createElement("script");

  if (gmapsScriptIsAdded) {
    return;
  }

  gmapsScript.setAttribute("async", "");
  gmapsScript.setAttribute("id", "gm-script");
  gmapsScript.setAttribute(
    "src",
    `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }&callback=Function.prototype&libraries=places`,
  );
  document.head.appendChild(gmapsScript);
};

onMounted(() => {
  f7ready(() => {
    cordovaApp.init(f7);
  });

  addGmapsScript();
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
</style>
