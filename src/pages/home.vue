<template>
  <f7-page class="hg-home-page" name="home">
    <img class="points-left" src="@/assets/images/pointsLeft.svg" alt="points left" />
    <img class="welcome-message" src="@/assets/images/welcomeMessage.svg" alt="Welcome Message" />

    <div class="titles-block">
      <h4 class="small-title">{{ $t("home.play-game") }}</h4>
      <h3 class="medium-title">{{ $t("home.improve-your-skills") }}</h3>
      <h2 class="big-title">{{ $t("home.be-the-first") }}</h2>
    </div>

    <div class="footer">
      <f7-button class="button" href="/register/">{{ $t("home.start-playing") }}</f7-button>
    </div>
  </f7-page>
</template>

<script setup>
defineProps({
  f7router: {
    type: Object,
    default: () => {},
  },
});
</script>

<style lang="scss">
@import "../assets/scss/pages/home";
</style>
