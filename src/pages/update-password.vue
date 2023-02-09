<template>
  <f7-page name="profile">
    <f7-navbar title="Update password" back-link="Back"></f7-navbar>
    <f7-block-title>Update password</f7-block-title>

    <f7-list class="profile-form" inline-labels no-hairlines-md>
      <f7-list-input
        v-model:value="updatePasswordData.newPassword"
        label="New password"
        type="password"
        placeholder="New password"
        clear-button
      />

      <f7-list-input
        v-model:value="updatePasswordData.confirmNewPassword"
        label="Confirm new password"
        type="password"
        placeholder="Confirm new password"
        clear-button
      />
    </f7-list>

    <f7-block>
      <f7-button color="blue" fill :disabled="disableSubmit" @click="updatePasswordHandler">Update</f7-button>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";

const { updateUser } = useAuthStore();

const updatePasswordData = reactive({
  newPassword: "",
  confirmNewPassword: "",
});
const disableSubmit = ref(false);

const validatePasswordUpdate = () => {
  if (!updatePasswordData.newPassword || !updatePasswordData.confirmNewPassword) {
    f7.toast.show({
      text: "Fill all the fields",
      closeButton: true,
    });

    return false;
  }

  if (updatePasswordData.newPassword.length < 6 || updatePasswordData.confirmNewPassword.length < 6) {
    f7.toast.show({
      text: "Passwords should contain at least 6 signs",
      closeButton: true,
    });

    return false;
  }

  if (updatePasswordData.newPassword !== updatePasswordData.confirmNewPassword) {
    f7.toast.show({
      text: "Passwords do not match",
      closeButton: true,
    });

    return false;
  }

  return true;
};

const updatePasswordHandler = () => {
  if (validatePasswordUpdate()) {
    disableSubmit.value = true;

    updateUser({ password: updatePasswordData.newPassword })
      .then(res => {
        if (res.status === "success") {
          f7.toast.show({
            text: "Password has been changed",
            closeButton: true,
          });

          return;
        }

        f7.toast.show({
          text: res.message,
          closeButton: true,
        });
      })
      .finally(() => (disableSubmit.value = false));
  }
};
</script>

<style scoped></style>
