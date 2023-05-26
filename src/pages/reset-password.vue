<template>
  <f7-page class="reset-password" name="reset-password" login-screen>
    <div>
      <f7-login-screen-title>{{ $t("reset-password.reset-password") }}</f7-login-screen-title>
      <f7-list form>
        <f7-list-input
          v-model:value="resetPasswordData.code"
          class="custom-list-input"
          type="text"
          name="code"
          :placeholder="$t('inputs.paste-email')"
        />
        <f7-list-input
          v-model:value="resetPasswordData.password"
          class="custom-list-input"
          type="password"
          name="password"
          :placeholder="$t('inputs.enter-password')"
        />
        <f7-list-input
          v-model:value="resetPasswordData.passwordConfirmation"
          class="custom-list-input"
          type="password"
          name="passwordConfirmation"
          :placeholder="$t('inputs.enter-password-again')"
        />
      </f7-list>
    </div>
    <f7-list>
      <f7-block>
        <f7-button class="button button-fill button-round button-raised button-large" @click="resetPasswordHandler">{{
          $t("reset-password.reset-password")
        }}</f7-button>
        <p class="err-msg">{{ errText }}</p>
        <f7-block-footer>
          <br />{{ $t("forgot-password.click") }} <a class="here-text" href="/">{{ $t("forgot-password.here") }}</a>
          {{ $t("forgot-password.to-back-main-page") }}</f7-block-footer
        >
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useAuthStore } from "@/js/stores/auth";
import { useI18n } from "vue-i18n";

const { resetPassword } = useAuthStore();

const props = defineProps({
  f7router: { type: Object, default: () => {} },
});

const isLoading = ref(false);
const resetPasswordData = reactive({
  code: "",
  password: "",
  passwordConfirmation: "",
});

const i18n = useI18n();
const errText = ref("");

const resetPasswordHandler = async () => {
  errText.value = "";
  if (resetPasswordData.password !== resetPasswordData.passwordConfirmation) {
    errText.value = i18n.t("reset-password.error-msg");
    return;
  }

  isLoading.value = true;

  await resetPassword(resetPasswordData).then(res => {
    if (res.status === "success") {
      props.f7router.navigate("/activity/");

      return;
    }

    errText.value = res.message;
  });

  isLoading.value = false;
};
</script>

<style lang="scss">
@import "@/assets/scss/pages/reset-password.scss";
</style>
