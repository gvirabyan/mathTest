<template>
  <f7-page class="hg-dashboard-content" name="dashboard">
    <top-bar
      :tabs="profileTabs"
      :search="false"
      by-route="Security"
      :first-load-index="1"
      @tab-selected="setProfileComponent"
    >
      <template #title>{{ $t("profile.profile") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal}  ${$t("top-bar.questions")}`
      }}</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <div class="profile-security">
          <f7-list form>
            <f7-list-input
              v-model:value="updatePasswordData.newPassword"
              :type="showPassword ? 'text' : 'password'"
              name="password"
              class="custom-list-input"
              :label="$t('inputs.new-password')"
            >
              <template #media>
                <div class="eye-icons" @click="showPassword = !showPassword">
                  <img v-if="showPassword" src="@/assets/icons/eye.svg" alt="eye" />
                  <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
                </div>
              </template>
            </f7-list-input>

            <f7-list-input
              v-model:value="updatePasswordData.confirmNewPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              name="password"
              class="custom-list-input"
              :label="$t('inputs.confirm-new-password')"
            >
              <template #media>
                <div class="eye-icons" @click="showConfirmPassword = !showConfirmPassword">
                  <img v-if="showConfirmPassword" src="@/assets/icons/eye.svg" alt="eye" />
                  <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
                </div>
              </template>
            </f7-list-input>

            <f7-block class="save-btn-block">
              <f7-button
                :class="{
                  'button-save button-large': true,
                  'button-fill': !disableSaveBtn,
                  'button-disabled-fill': disableSaveBtn,
                }"
                @click="updatePasswordHandler"
              >
                {{ $t("buttons.save") }}
              </f7-button>
              <p class="error-message">{{ errorMessage }}</p>
            </f7-block>
          </f7-list>
        </div>
      </Transition>
    </main>

    <success-message-popup v-if="successPopup" :title="$t('profile.security.popup-text')" @close="closeSuccessPopup" />

    <leave-page-popup
      v-if="securityLeavePopup"
      @leave-changes="discardChanges"
      @save-changes="updatePasswordHandler"
      @close="closeLeavePopup"
    />

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { ref, reactive, computed, watch } from "vue";
import { useAuthStore } from "@/js/stores/auth";

import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue";
import LeavePagePopup from "@/components/leave-page-popup.vue";
import { storeToRefs } from "pinia/dist/pinia";
import { useI18n } from "vue-i18n";
import playAudioMixin from "@/js/mixins/play_audio";

const authStore = useAuthStore();
const { updateUser, changePasswords, changeSecurityPath, changeSecurityLeavePopup } = authStore;
const { user, securityPath } = storeToRefs(authStore);
const successPopup = ref(false);
const { securityLeavePopup } = storeToRefs(authStore);

const { playAudio } = playAudioMixin.setup();

const props = defineProps({
  f7route: { type: Object, default: () => {} },
  f7router: { type: Object, default: () => {} },
});

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

const updatePasswordData = reactive({
  newPassword: "",
  confirmNewPassword: "",
});

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

function closeSuccessPopup() {
  successPopup.value = false;
  if (securityPath.value) {
    props.f7router.navigate(securityPath.value);
    changeSecurityPath("");
  }
}

function closeLeavePopup() {
  changeSecurityLeavePopup();
}

function discardChanges() {
  updatePasswordData.newPassword = "";
  updatePasswordData.confirmNewPassword = "";
  if (securityPath.value) {
    props.f7router.navigate(securityPath.value);
    securityLeavePopup.value = false;
    securityPath.value = "";
  }
}

const errorMessage = ref("");
const disableSubmit = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const disableSaveBtn = computed(() => !updatePasswordData.newPassword || !updatePasswordData.confirmNewPassword);

const validatePasswordUpdate = () => {
  errorMessage.value = "";

  if (updatePasswordData.newPassword.length < 6 || updatePasswordData.confirmNewPassword.length < 6) {
    errorMessage.value = "Passwords should contain at least 6 signs";
    return false;
  }

  if (updatePasswordData.newPassword !== updatePasswordData.confirmNewPassword) {
    errorMessage.value = "Passwords do not match";
    return false;
  }

  return true;
};

const updatePasswordHandler = async () => {
  if (!disableSaveBtn.value && validatePasswordUpdate()) {
    disableSubmit.value = true;
    playAudio("formSubmit");
    await updateUser({ password: updatePasswordData.newPassword })
      .then(res => {
        if (res.status === "success") {
          localStorage.removeItem("passwords");
          successPopup.value = true;
          return;
        }
        errorMessage.value = res.message;
      })
      .finally(() => {
        updatePasswordData.confirmNewPassword = "";
        updatePasswordData.newPassword = "";
        disableSubmit.value = false;
      });
  } else {
    validatePasswordUpdate();
  }
  securityLeavePopup.value = false;
};

watch(
  () => updatePasswordData,
  obj => {
    changePasswords(obj);
  },
  {
    deep: true,
  },
);
</script>

<style lang="scss">
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/pages/security.scss";
</style>
