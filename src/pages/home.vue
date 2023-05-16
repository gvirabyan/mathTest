<template>
  <f7-page class="hg-home-page" name="home">
    <h1 class="welcome-message">Welcome</h1>

    <img class="points-left" src="@/assets/images/pointsLeft.svg" alt="points left" />

    <div class="titles-block">
      <h4 class="small-title">Play the games</h4>
      <h3 class="medium-title">Improve your skills</h3>
      <h2 class="big-title">Be the first in the World</h2>
    </div>

    <div class="footer">
      <f7-button class="button" href="/register/"> Start playing</f7-button>
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
