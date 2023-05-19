<template>
  <f7-app v-bind="f7params">
    <!-- Left panel with cover effect-->
    <f7-panel left cover dark>
      <f7-page>
        <f7-navbar title="Menu" />

        <main-menu />
      </f7-page>
    </f7-panel>

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/" />

    <Loading v-if="!loaded" />
  </f7-app>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { f7, f7ready } from "framework7-vue";
import { storeToRefs } from "pinia";
import routes from "../js/routes.js";
import cordovaApp from "@/js/cordova-app";
import { useAuthStore } from "@/js/stores/auth";
import { useEverydayGoalStore } from "@/js/stores/everyday-goal";
import { useUserStats } from "@/js/stores/user-stats";
import { isYesterday } from "@/js/utils/date-check";
import MainMenu from "./main-menu.vue";
import Loading from "@/components/loading.vue";

const authStore = useAuthStore();
const everydayGoalStore = useEverydayGoalStore();
const userStatsStore = useUserStats();

const { getUser } = authStore;
const { getUserStatus } = userStatsStore;

const { everydayGoal } = storeToRefs(everydayGoalStore);
const { restartEverydayGoal } = everydayGoalStore;

const f7params = {
  name: "Mathe App", // App name
  theme: "auto", // Automatic theme detection
  routes: routes, // App routes
};

const loaded = ref(false);

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

const checkEverydayGoalPassingDate = () => {
  if (!everydayGoal.value?.passingDatetime) {
    return;
  }

  const passingDatetime = new Date(everydayGoal.value?.passingDatetime);

  if (!isYesterday(passingDatetime)) {
    return;
  }

  restartEverydayGoal();
};

onMounted(async () => {
  f7ready(() => {
    cordovaApp.init(f7);
  });

  if (localStorage.getItem("user-id") && localStorage.getItem("token")) {
    await getUserStatus()
      .then(() => {
        loaded.value = true;

        getUser().then(data => {
          if (data.status === "error") {
            return false;
          }
        });
      })
      .catch(() => {
        localStorage.removeItem("user-id");
        localStorage.removeItem("token");
        setTimeout(() => {
          loaded.value = true;
        }, 2000);
      });
  } else {
    localStorage.removeItem("user-id");
    localStorage.removeItem("token");
    setTimeout(() => {
      loaded.value = true;
    }, 2000);
  }

  addGmapsScript();
  checkEverydayGoalPassingDate();
});
</script>

<style>
.loading-page {
  padding: 20px;
  background: #212121;
}
</style>
