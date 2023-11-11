<template>
  <f7-page class="hg-dashboard-content about-us-page" name="dashboard" @page:beforein="getAllData">
    <top-bar :tabs="profileTabs" :search="false" :first-load-index="2" @tab-selected="setProfileComponent">
      <template #title>{{ $t("profile.profile") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal}  ${$t("top-bar.questions")}`
      }}</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <f7-list>
          <f7-list-item v-for="info in infos" :key="info.title">
            <template #title>
              <f7-button @click="changPopupAboutUs(info.popup)">
                <f7-row class="justify-content-space-between align-items-center">
                  <p class="info-title">{{ info.title }}</p>
                  <img src="@/assets/icons/arrow-right.svg" alt="" />
                </f7-row>
              </f7-button>
            </template>
          </f7-list-item>
        </f7-list>
      </Transition>
    </main>

    <component :is="getPopup" v-if="popupAboutUs" @close="changPopupAboutUs(false)" />

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import TermsPopup from "@/components/terms-popup.vue";
import PrivacyPopup from "@/components/privacy-popup.vue";
import ImprintPopup from "@/components/imprint-popup.vue";
import SoftwarePopup from "@/components/software-popup.vue";
import ReleasePopup from "@/components/release-popup.vue";
import ReviewPopup from "@/components/review-popup.vue";

const props = defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
  f7router: {
    type: Object,
    default: () => {},
  },
});

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const { getUser } = authStore;

const i18n = useI18n();

const profileTabs = ref([
  {
    id: 1,
    name: i18n.t("profile.tabs.0"),
    path: "/profile/account/",
  },
  {
    id: 2,
    name: i18n.t("profile.tabs.1"),
    path: "/profile/security/",
  },
  {
    id: 3,
    name: i18n.t("profile.tabs.2"),
    path: "/profile/about-us/",
  },
  {
    id: 4,
    name: i18n.t("profile.tabs.3"),
    path: "/profile/send-reports/",
  },
  {
    id: 5,
    name: i18n.t("profile.tabs.4"),
    path: "/profile/profile-sound/",
  },
]);

const infos = reactive([
  {
    title: i18n.t("profile.about-us.terms-of-services"),
    popup: "TermsPopup",
  },
  {
    title: i18n.t("profile.about-us.privacy"),
    popup: "PrivacyPopup",
  },
  {
    title: i18n.t("profile.about-us.imprint"),
    popup: "ImprintPopup",
  },
  {
    title: i18n.t("profile.about-us.software-licenses"),
    popup: "SoftwarePopup",
  },
  {
    title: i18n.t("profile.about-us.release-notes"),
    popup: "ReleasePopup",
  },
  {
    title: i18n.t("profile.about-us.write-review"),
    popup: "ReviewPopup",
  },
]);

const isLoading = ref(false);

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

const getAllData = async () => {
  isLoading.value = true;

  await delay();
  await Promise.all([getUser()]);

  isLoading.value = false;
};

const popupAboutUs = ref(false);
const changPopupAboutUs = value => {
  popupAboutUs.value = value;
};
const getPopup = computed(() =>
  popupAboutUs.value === "TermsPopup"
    ? TermsPopup
    : popupAboutUs.value === "PrivacyPopup"
    ? PrivacyPopup
    : popupAboutUs.value === "ImprintPopup"
    ? ImprintPopup
    : popupAboutUs.value === "SoftwarePopup"
    ? SoftwarePopup
    : popupAboutUs.value === "ReleasePopup"
    ? ReleasePopup
    : popupAboutUs.value === "ReviewPopup"
    ? ReviewPopup
    : false,
);
</script>

<style lang="scss">
//@import "../assets/scss/pages/profile";
@import "../assets/scss/pages/about-us";
@import "@/assets/scss/components/about-us-popups.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
