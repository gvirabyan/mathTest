<template>
  <f7-app v-bind="f7params" >

    <!-- Left panel with cover effect-->
    <f7-panel left cover dark>
      <f7-page>
        <f7-navbar title="Menu"></f7-navbar>

        <main-menu/>
      </f7-page>
    </f7-panel>


    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>
  </f7-app>
</template>
<script setup>
  import { ref, onMounted } from 'vue';
  import { f7, f7ready } from 'framework7-vue';
  import MainMenu from './main-menu.vue'

  import routes from '../js/routes.js';

  const f7params = {
    name: 'Math App', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes: routes,
  };

  window.checkAndAttachMapScript = function (callback) {
    let scriptId = "gm-script";
    let mapAlreadyAttached = !!document.getElementById(scriptId);

    if (mapAlreadyAttached) {
      if (window.google) { // Script attached but may not finished loading; so check for 'google' object.
        callback();
      }
    }
    else {
      window.mapApiInitialized = callback;

      const scriptStr = `<script async id="gm-script" src="https://maps.googleapis.com/maps/api/js?libraries=places&amp;key=${import.meta.env.VITE_GOOGLE_API_KEY}" />`;
      const module = document.getElementById('module');
      module.insertAdjacentHTML('beforebegin', scriptStr)
    }

    return mapAlreadyAttached;
  }

  onMounted(() => {
    f7ready(() => {
      // Call F7 APIs here
    });
  });
</script>
