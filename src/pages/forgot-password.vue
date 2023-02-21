<template>
  <f7-page name="forgot-password" login-screen>
    <f7-navbar title="Forgot Password?" back-link="Back" />
    <f7-login-screen-title>Forgot Password?</f7-login-screen-title>

    <f7-list form>
      <f7-list-input v-model:value="email" type="text" name="email" placeholder="Your email" />
    </f7-list>

    <f7-list>
      <f7-block>
        <f7-button
          class="button button-fill button-round button-raised button-large"
          :disabled="isLoading"
          @click="forgotPasswordHandler"
          >Send email</f7-button
        >

        <f7-block-footer> <br />Click <a href="/">here</a> to back Main page </f7-block-footer>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { f7 } from "framework7-vue";
import { useAuthStore } from "@/js/stores/auth";

const { forgotPassword } = useAuthStore();

const props = defineProps({
  f7router: Object,
});

const isLoading = ref(false);
const email = ref("");

const forgotPasswordHandler = async () => {
  isLoading.value = true;

  await forgotPassword(email.value).then(res => {
    if (res.status === "success") {
      props.f7router.navigate("/reset-password/");

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
