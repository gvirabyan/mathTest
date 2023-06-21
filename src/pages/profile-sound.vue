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
                <switch-button :switch-value="user.sound" @change-switch-value="changeSoundValue" />
              </f7-row>
              <f7-row class="justify-content-space-between align-items-center sound-volume">
                <p class="info-title">{{ $t("profile.sound.sound-volume") }}</p>
                <input
                  v-model="soundVolume"
                  class="volume"
                  type="range"
                  min="0"
                  max="100"
                  @input="updateSoundVolume"
                  @touchend="playAudio('correct')"
                />
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
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SwitchButton from "@/components/switch-button.vue";
import playAudioMixin from "@/js/mixins/play_audio";

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

const { playAudio, correct } = playAudioMixin.setup();

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const { updateUser } = authStore;

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
const soundVolume = ref(50);

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

const getAllData = () => {
  soundVolume.value = user.value.sound ? user.value.volume_sound : 0;
  document.documentElement.style.setProperty("--value", soundVolume.value);
};

const changeSoundValue = () => {
  user.value.sound = !user.value.sound;
  if (!user.value.sound) {
    soundVolume.value = 0;
    document.documentElement.style.setProperty("--value", soundVolume.value);
    correct.pause();
    correct.currentTime = 0;
    playAudio("correct");
  } else if (Number(soundVolume.value) === 0) {
    soundVolume.value = user.value.volume_sound || 10;
    document.documentElement.style.setProperty("--value", soundVolume.value);
    user.value.volume_sound = Number(soundVolume.value);
    correct.pause();
    correct.currentTime = 0;
    playAudio("correct");
    updateUser({
      volume_sound: soundVolume.value,
      sound: user.value.sound,
    });
    return;
  }
  updateUser({
    sound: user.value.sound,
  });
};

function updateSoundVolume() {
  const volume = Number(user.value.volume_sound);
  document.documentElement.style.setProperty("--value", soundVolume.value);
  if (volume === 0 || Number(soundVolume.value) === 0 || !user.value.sound) {
    updateUser({
      sound: !user.value.sound,
    });
    user.value.sound = !user.value.sound;
  }
  user.value.volume_sound = Number(soundVolume.value);
  correct.pause();
  correct.currentTime = 0;
  updateUser({
    volume_sound: soundVolume.value,
  });
}
</script>

<style lang="scss">
@import "../assets/scss/pages/profile";
@import "../assets/scss/pages/profile-sound";
</style>
