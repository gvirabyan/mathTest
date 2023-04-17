<template>
  <f7-page class="hg-dashboard-content" name="dashboard">
    <top-bar
      :tabs="profileTabs"
      :search="false"
      by-route="Security"
      :first-load-index="1"
      @tab-selected="setProfileComponent"
    >
      <template #title>Profile</template>
      <template #subtitle>Username</template>
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
              label="New password"
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
              label="Confirm new password"
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
                Save
              </f7-button>
              <p class="error-message">{{ errorMessage }}</p>
            </f7-block>
          </f7-list>
        </div>
      </Transition>
    </main>
    <success-message-popup v-if="successPopup" title="Password has been changed" @close="closeSuccessPopup" />
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
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";

import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue";
import LeavePagePopup from "@/components/leave-page-popup.vue";
import { storeToRefs } from "pinia/dist/pinia";

const authStore = useAuthStore();
const { updateUser } = authStore;
const { changePasswords } = authStore;
const { changeSecurityPath } = authStore;
const { changeSecurityLeavePopup } = authStore;
const { securityPath } = storeToRefs(authStore);
const { passwords } = storeToRefs(authStore);
// const { successPopup } = storeToRefs(authStore);
const successPopup = ref(false);
const { securityLeavePopup } = storeToRefs(authStore);

const updatePasswordData = reactive({
  newPassword: "",
  confirmNewPassword: "",
});

// watch(
//   () => updatePasswordData,
//   (obj) => {
//     localStorage.setItem('passwords', JSON.stringify(obj))
//   },
//   {
//     immediate: true,
//     deep: true
//   }
// )

const emit = defineEmits(["open-success-popup"]);

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const profileTabs = ref([
  {
    id: 1,
    name: "Account",
    path: "/profile/account/",
    // component: markRaw(Account),
  },
  {
    id: 2,
    name: "Security",
    path: "/profile/security/",
    // component: markRaw(Security),
  },
  {
    id: 3,
    name: "About Us",
    path: "/profile/about-us/",
    // component: markRaw(AboutUs),
  },
  {
    id: 4,
    name: "Send Reports",
    path: "/profile/send-reports/",
  },
]);

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

const disableSaveBtn = computed(() =>
  !updatePasswordData.newPassword || !updatePasswordData.confirmNewPassword ? true : false,
);

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
@import "../assets/scss/pages/profile";
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/pages/security.scss";
</style>
