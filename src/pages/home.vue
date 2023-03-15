<template>
  <f7-page class="hg-home-page" name="home">
    <f7-navbar :sliding="false">
      <f7-nav-title sliding>Math</f7-nav-title>
    </f7-navbar>

    <f7-block>
      <f7-row>
        <h1 class="hg-welcome-message">Welcome to Math!</h1>
      </f7-row>

      <f7-row class="hg-actions-btns-content">
        <f7-button class="button button-outline button-round button-raised hg-default-btn-width" href="/login/"
          >Sign In</f7-button
        >

        <f7-button class="button button-outline button-round button-raised hg-default-btn-width" href="/register/"
          >Sign Up</f7-button
        >
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  f7router: Object,
});

const search = ref(window.location.search || null);

watch(
  search,
  val => {
    if (!val) {
      return;
    }

    const provider = window.location.pathname.split("/")[2];

    props.f7router.navigate({ name: "ProviderLoginRedirect", params: { provider } });
  },
  { immediate: true },
);
</script>

<style lang="scss">
@import "../assets/scss/pages/home";
</style>
