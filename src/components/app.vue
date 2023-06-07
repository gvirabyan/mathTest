<template>
  <f7-app v-bind="f7params">
    <custom-popup
      ref="customPopupRef"
      :is-opened-initial="openRightPanel"
      class="notifications-panel"
      @close-popup="openRightPanel = false"
    >
      <template #title>
        <h2 class="title">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16.4997 8.25C16.4997 9.77778 16.4997 11.3056 16.4997 12.8333C16.4997 14.6667 17.1108 15.8889 18.333 16.5H3.66634C4.88856 15.8889 5.49968 14.6667 5.49968 12.8333C5.49968 11.3056 5.49968 9.77778 5.49968 8.25C5.49968 5.21243 7.96211 2.75 10.9997 2.75C14.0372 2.75 16.4997 5.21243 16.4997 8.25Z"
              stroke="#8419FF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M9.16634 17.4165C9.16634 18.429 9.98715 19.2498 10.9997 19.2498C12.0122 19.2498 12.833 18.429 12.833 17.4165"
              stroke="#8419FF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>

          {{ $t("top-bar.notifications") }}
        </h2>
      </template>

      <template #content>
        <notifications />
      </template>
    </custom-popup>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/" />

    <Loading v-if="!loaded" />
  </f7-app>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { f7, f7ready } from "framework7-vue";
import { useElementVisibility, useEventBus } from "@vueuse/core";
import routes from "../js/routes.js";
import cordovaApp from "@/js/cordova-app";
import { useAuthStore } from "@/js/stores/auth";
import { useUserStats } from "@/js/stores/user-stats";
import Loading from "@/components/loading.vue";
import Notifications from "@/components/notifications.vue";
import CustomPopup from "@/components/custom-popup.vue";

const bus = useEventBus("notifications");
bus.on((e, payload) => {
  openRightPanel.value = payload;
});

const authStore = useAuthStore();
const userStatsStore = useUserStats();

const { getUser, sendAppInfo, checkEverydayGoal } = authStore;
const { getUserStatus } = userStatsStore;

const f7params = {
  name: "Mathe App", // App name
  theme: "auto", // Automatic theme detection
  routes: routes, // App routes
};

const loaded = ref(false);
const openRightPanel = ref(false);
const customPopupRef = ref(null);
const customPopupIsVisible = useElementVisibility(customPopupRef);

const addGmapsScript = () => {
  // dynamic adding of Google map script on app creation
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

watch(customPopupIsVisible, value => {
  if (value) return;

  openRightPanel.value = false;
});

onMounted(async () => {
  f7ready(() => {
    cordovaApp.init(f7);
  });

  if (localStorage.getItem("user-id") && localStorage.getItem("token")) {
    await getUserStatus().then(() => {
      loaded.value = true;
      getUser().then(data => {
        if (data.status === "error") {
          localStorage.removeItem("user-id");
          localStorage.removeItem("token");
        }
      });
    });

    await sendAppInfo();
    await checkEverydayGoal();
  } else {
    localStorage.removeItem("user-id");
    localStorage.removeItem("token");
    setTimeout(() => {
      loaded.value = true;
    }, 2000);
  }

  addGmapsScript();
});
</script>

<style>
.loading-page {
  padding: 20px;
  background: #212121;
}
</style>
