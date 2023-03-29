<template>
  <f7-page class="hg-home-page" name="home">
    <h1 class="welcome-message">Welcome</h1>
    <img
        class="points-left"
        src="@/assets/images/pointsLeft.png"
    >
    <div class="titles-block">
      <h4 class="small-title">Play the games</h4>
      <h3 class="medium-title">Improve your skills</h3>
      <h2 class="big-title">Be the first in the World</h2>
    </div>
    <f7-button class="button" href="/login/"> Start playing </f7-button>
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
