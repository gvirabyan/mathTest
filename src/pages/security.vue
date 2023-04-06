<template>
  <f7-page-master-detail class="profile-security">
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
        <p class="error-message">{{errorMessage}}</p>
      </f7-block>
    </f7-list>
  </f7-page-master-detail>
</template>

<script setup>
import {ref, reactive, computed} from "vue";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";

const { updateUser } = useAuthStore();

const updatePasswordData = reactive({
  newPassword: "",
  confirmNewPassword: "",
});

const emit  = defineEmits(['open-success-popup'])

const errorMessage = ref('');
const disableSubmit = ref(false);

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const disableSaveBtn = computed(() => !updatePasswordData.newPassword || !updatePasswordData.confirmNewPassword ? true : false)

const validatePasswordUpdate = () => {
  errorMessage.value = '';

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

const successPopup = ref(false);
const updatePasswordHandler = () => {
  if (!disableSaveBtn.value && validatePasswordUpdate()) {
    disableSubmit.value = true;

    updateUser({ password: updatePasswordData.newPassword })
        .then(res => {
          if (res.status === "success") {
            emit('open-success-popup', 'Password has been changed')
            return;
          }
          errorMessage.value = res.message
        })
        .finally(() => (disableSubmit.value = false));
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/pages/security.scss";
</style>
