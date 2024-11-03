<template>
  <f7-app v-bind="f7params">
    <f7-panel
      id="notifications-panel"
      right
      cover
      swipe-only-close
      backdrop
      container-el=".framework7-root"
      @panel:open="playAudio('notificationOpen')"
    >
      <f7-page>
        <f7-navbar>
          <f7-nav-left>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.4997 8.25C16.4997 9.77778 16.4997 11.3056 16.4997 12.8333C16.4997 14.6667 17.1108 15.8889 18.333 16.5H3.66634C4.88856 15.8889 5.49968 14.6667 5.49968 12.8333C5.49968 11.3056 5.49968 9.77778 5.49968 8.25C5.49968 5.21243 7.96211 2.75 10.9997 2.75C14.0372 2.75 16.4997 5.21243 16.4997 8.25Z"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.16634 17.4165C9.16634 18.429 9.98715 19.2498 10.9997 19.2498C12.0122 19.2498 12.833 18.429 12.833 17.4165"
                stroke="#fff"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ $t("top-bar.notifications") }}
          </f7-nav-left>
          <f7-nav-right>
            <f7-link panel-close>
              <img src="@/assets/icons/x-white.svg" height="20" width="20" />
            </f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block strong-ios outline-ios>
          <!--          <p @click="readAllNotifications" style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="5" cy="5" r="5" fill="#FFC700" />
            </svg>
            {{ $t("notification.mark-all-read") }}
          </p>-->
          <notifications />
        </f7-block>
      </f7-page>
    </f7-panel>

    <success-message-popup
      v-if="isNoConnectionPopup"
      :title="$t('messages.no-connection-title')"
      :text="$t('messages.no-connection-text')"
      :btn-text="$t('buttons.ok')"
      @close="closeNoConnectionPopupHandler"
    />

    <f7-view main class="safe-areas" url="/" />

    <Loading v-if="!loaded" />
  </f7-app>
</template>
<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { f7, f7ready } from "framework7-vue";
import { storeToRefs } from "pinia/dist/pinia";
import { useNetwork } from "@vueuse/core";
import { useI18n } from "vue-i18n";
import routes from "../js/routes.js";
import cordovaApp from "@/js/cordova-app";
import { useAuthStore } from "@/js/stores/auth";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useQuestionsStore } from "@/js/stores/questions";
import { useUserStats } from "@/js/stores/user-stats";
import Loading from "@/components/loading.vue";
import Notifications from "@/components/notifications.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue";
import { useNotifications } from "@/js/stores/notifications";
import playAudioMixin from "@/js/mixins/play_audio";

const { playAudio } = playAudioMixin.setup();
const i18n = useI18n();

const authStore = useAuthStore();
const categoryAnswerStore = useCategoryAnswerStore();
const questionStore = useQuestionsStore();
const userStatsStore = useUserStats();

const { getUser, sendAppInfo, checkEverydayGoal } = authStore;
const { user } = storeToRefs(authStore);
const { updateUserAnsweredQuestions } = categoryAnswerStore;
const { getQuestions, getAnsweredQuestions } = questionStore;
const { offline, questions, categoryQuestion } = storeToRefs(questionStore);
const { getUserStatus } = userStatsStore;
const { readAllNotifications } = useNotifications();

const f7params = {
  name: "Mathe App", // App name
  theme: "auto", // Automatic theme detection
  routes: routes, // App routes
};

const slowConnectionTypes = ["Cell 2G connection", "Cell 3G connection"];

const loaded = ref(false);
const isNoConnectionPopup = ref(false);
const network = reactive(useNetwork());
const networkCurrentState = ref(null);

const checkConnection = () => {
  if (!window.cordova) return;

  const networkState = navigator.connection.type;
  const states = {};

  /* eslint-disable */
  states[Connection.UNKNOWN] = "Unknown connection";
  states[Connection.ETHERNET] = "Ethernet connection";
  states[Connection.WIFI] = "WiFi connection";
  states[Connection.CELL_2G] = "Cell 2G connection";
  states[Connection.CELL_3G] = "Cell 3G connection";
  states[Connection.CELL_4G] = "Cell 4G connection";
  states[Connection.CELL] = "Cell generic connection";
  states[Connection.NONE] = "No network connection";
  /* eslint-enable */

  networkCurrentState.value = states[networkState];
};

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

const closeNoConnectionPopupHandler = () => {
  isNoConnectionPopup.value = false;
};

watch(
  () => network.isOnline,
  value => {
    if (!value && f7.views.main.router.currentRoute.name !== "Question") {
      isNoConnectionPopup.value = true;
    }
    // send answered questions when user is online
    if (offline.value && value) {
      offline.value = false;
      getQuestions(categoryQuestion.value.id, false)
        .then(data => {
          if (data.data.results.length) {
            return data;
          } else {
            getAnsweredQuestions(categoryQuestion.value.id);
          }
        })
        .then(async data => {
          for (const question of data.data.results) {
            const answeredData = questions.value.find(r => r.id === question.id);
            if (answeredData && answeredData.user_answer) {
              await updateUserAnsweredQuestions({
                users_permissions_user: user.value.id,
                question: answeredData.id,
                category: categoryQuestion.value.id,
                answer: answeredData.user_answer.answer,
                status: answeredData.user_answer.status,
                answer_type: "topic",
              });
            }
          }
        })
        .catch(err => {
          offline.value = true;
        });
    }
  },
);

watch(networkCurrentState, (value, oldValue) => {
  if (slowConnectionTypes.includes(value) && slowConnectionTypes.includes(oldValue)) {
    return;
  }

  if (slowConnectionTypes.includes(value) && !slowConnectionTypes.includes(oldValue)) {
    f7.toast.show({
      text: i18n.t("messages.slow-connection"),
      closeButton: true,
    });

    return;
  }

  if (network.isOnline && !slowConnectionTypes.includes(value) && slowConnectionTypes.includes(oldValue)) {
    f7.toast.show({
      text: i18n.t("messages.stable-connection"),
      closeButton: true,
    });
  }
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
  setInterval(checkConnection, 2000);
});
</script>

<style>
:root {
  --f7-panel-width: 80%;
  --f7-panel-backdrop-bg-color: rgba(0, 0, 0, 0.62);
  --f7-navbar-bg-color: #8419ff;
  --f7-navbar-bg-color-rgb: 132, 25, 255;
  --f7-navbar-bg-image: url("@/assets/images/pointsRight.svg");
  --f7-bars-bg-image: "../assets/images/pointsRight.svg";
  --f7-navbar-inner-padding-right: 0;
  --f7-navbar-inner-padding-left: 0;
  --f7-navbar-text-color: #fff;
  --f7-block-padding-horizontal: 28px;
}
.ios {
  --f7-page-bg-color: #fff;
  --f7-toolbar-height: 74px;
  --f7-navbar-height: 152px;
}
.md {
  --f7-toolbar-height: 74px;
  --f7-navbar-height: 152px;
}
.loading-page {
  padding: 20px;
  background: #212121;
}
#notifications-panel {
  max-width: 450px;
  --f7-navbar-height: 56px;
  .navbar-inner {
    padding: 0 12px;
    .left {
      font-weight: 700;
    }
  }
}
</style>
