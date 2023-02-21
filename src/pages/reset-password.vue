<template>
  <f7-page name="reset-password" login-screen>
    <f7-navbar title="Reset Password" back-link="Back" />
    <f7-login-screen-title>Reset Password</f7-login-screen-title>

    <f7-list form>
      <f7-list-input
        v-model:value="resetPasswordData.code"
        type="text"
        name="code"
        placeholder="Paste the code from the email"
      />
      <f7-list-input
        v-model:value="resetPasswordData.password"
        type="password"
        name="password"
        placeholder="Enter your password"
      />
      <f7-list-input
        v-model:value="resetPasswordData.passwordConfirmation"
        type="password"
        name="passwordConfirmation"
        placeholder="Enter your password once again"
      />
    </f7-list>

    <f7-list>
      <f7-block>
        <f7-button class="button button-fill button-round button-raised button-large" @click="resetPasswordHandler"
          >Reset password</f7-button
        >

        <f7-block-footer> <br />Click <a href="/">here</a> to back Main page </f7-block-footer>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "@/js/stores/auth";
import { f7 } from "framework7-vue";

const { resetPassword } = useAuthStore();

const props = defineProps({
  f7router: Object,
});

const isLoading = ref(false);
const resetPasswordData = reactive({
  code: "",
  password: "",
  passwordConfirmation: "",
});

const resetPasswordHandler = async () => {
  if (resetPasswordData.password !== resetPasswordData.passwordConfirmation) {
    f7.toast.show({
      text: "Password and password confirmation should match",
      closeButton: true,
    });

    return;
  }

  isLoading.value = true;

  await resetPassword(resetPasswordData).then(res => {
    if (res.status === "success") {
      props.f7router.navigate("/dashboard/");

      return;
    }

    f7.toast.show({
      text: res.message,
      closeButton: true,
    });
  });

  isLoading.value = false;
};
</script>

<style scoped></style>
