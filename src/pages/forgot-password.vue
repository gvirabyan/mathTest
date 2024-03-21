<template>
  <f7-page class="forgot-password" name="forgot-password" login-screen>
    <f7-login-screen-title>{{ $t("forgot-password.forgot-password") }}</f7-login-screen-title>

    <f7-list form>
      <f7-list-input
        v-model:value="email"
        class="custom-list-input"
        type="email"
        name="email"
        autocapitalize="none"
        :error-message-force="!!error.length"
        :error-message="error"
        :placeholder="$t('inputs.your-email')"
      />
    </f7-list>

    <f7-list>
      <f7-block>
        <f7-button
          class="button button-fill button-round button-raised button-large"
          :disabled="isLoading"
          @click="forgotPasswordHandler"
          >{{ $t("forgot-password.send-email") }}</f7-button
        >

        <f7-block-footer>
          <br />{{ $t("forgot-password.click") }} <a class="here-text" href="/">{{ $t("forgot-password.here") }}</a>
          {{ $t("forgot-password.to-back-main-page") }}</f7-block-footer
        >
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/js/stores/auth";

const { forgotPassword } = useAuthStore();

const props = defineProps({
  f7router: { type: Object, default: () => {} },
});

const isLoading = ref(false);
const email = ref("");

const error = ref("");

const forgotPasswordHandler = async () => {
  isLoading.value = true;
  error.value = "";
  await forgotPassword(email.value).then(res => {
    if (res.status === "success") {
      props.f7router.navigate("/reset-password/");

      return;
    }

    error.value = res.message;
  });

  isLoading.value = false;
};
</script>

<style lang="scss">
@import "@/assets/scss/pages/forgot-password.scss";
</style>
