<template>
  <f7-page name="provide-login-redirect" @page:afterin="redirectHandler">
    <f7-block>
      <p>{{ text }}</p>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/js/stores/auth";

const props = defineProps({
  f7router: Object,
});

alert("foobar");

const { loginViaProvider } = useAuthStore();
const text = ref("Loading");

const redirectHandler = () => {
  const provider = props.f7router.currentRoute.params.provider;
  const accessToken = props.f7router.initialUrl;

  loginViaProvider(provider, accessToken).then(res => {
    if (res.status === "success") {
      text.value = "You have been successfully logged in. You will be redirected in a few seconds...";

      setTimeout(() => props.f7router.navigate("/dashboard/"), 2000);

      return;
    }

    text.value = "An error occurred, please try again.";
  });
};
</script>

<style lang="scss" scoped></style>
