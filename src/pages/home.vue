<template>
  <f7-page className="hg-home-page" name="home">
    <h1 className="welcome-message">Welcome</h1>
    <img
        className="points-left"
        src="@/assets/images/pointsLeft.png"
    >
    <div className="titles-block">
      <h4 className="small-title">Play the games</h4>
      <h3 className="medium-title">Improve your skills</h3>
      <h2 className="big-title">Be the first in the World</h2>
    </div>
    <div className="footer">
      <f7-button class="button" href="/register/"> Start playing</f7-button>
    </div>
  </f7-page>
</template>

<script setup>
const props = defineProps({
  f7router: Object,
});
</script>

<style lang="scss">
@import "../assets/scss/pages/home";
</style>
