<template>
  <f7-page class="hg-dashboard-content profile-sound" name="dashboard" @page:beforein="getAllData">
    <top-bar :tabs="profileTabs" :search="false" :first-load-index="4" @tab-selected="setProfileComponent">
      <template #title>{{ $t("profile.profile") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal}  ${$t("top-bar.questions")}`
      }}</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <f7-list>
          <f7-list-item>
            <template #title>
              <f7-row class="justify-content-space-between align-items-center">
                <p class="info-title">{{ $t("profile.sound.sound") }}</p>
                <switch-button :switch-value="!!user.sound" @change-switch-value="changeSoundValue" />
              </f7-row>
              <f7-row class="justify-content-space-between align-items-center sound-volume">
                <p class="info-title">{{ $t("profile.sound.sound-volume") }}</p>
                <input class="volume" type="range" min="0" max="100" :value="user.volume_sound" />
              </f7-row>
            </template>
          </f7-list-item>
        </f7-list>
      </Transition>
    </main>

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/js/stores/auth";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SwitchButton from "@/components/switch-button.vue";

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
const { getUser, updateUser } = authStore;

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
const isLoading = ref(false);

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

const getAllData = async () => {
  await delay();
  await Promise.all([getUser()]);
};

const changeSoundValue = () => {
  updateUser({
    sound: !user.value.sound,
  });
  user.value.sound = !user.value.sound;
};
</script>

<style lang="scss">
@import "../assets/scss/pages/profile";
@import "../assets/scss/pages/profile-sound";
</style>
