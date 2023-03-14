<template>
  <f7-page name="provide-login-redirect">
    <p>{{ text }}</p>
  </f7-page>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  f7router: Object,
});

const backendUrl = import.meta.env.VITE_API_URL;
// const
const text = ref("Loading");

const redirectHandler = () => {
  fetch(`${backendUrl}/api/auth/${props.f7router.currentRoute.provider}/callback${props.f7router.initialUrl}`)
    .then(res => {
      if (res.status !== 200) {
        throw new Error(`Couldn't login to Strapi. Status: ${res.status}`);
      }
      return res;
    })
    .then(res => res.json())
    .then(res => {
      // Successfully logged with Strapi
      // Now saving the jwt to use it for future authenticated requests to Strapi
      console.log(res);
      text.value = "You have been successfully logged in. You will be redirected in a few seconds...";
      setTimeout(() => history.push("/"), 200);
    })
    .catch(err => {
      console.log(err);
      text.value = "An error occurred, please see the developer console.";
    });
};

onMounted(() => {
  redirectHandler();
});
</script>

<style lang="scss" scoped></style>
