<template>
  <f7-page class="hg-categories-page" name="player-vs-machine">
    <f7-navbar title="Player vs. Machine" back-link="Back" />

    <f7-block>Boop {{ f7route.params.modeID }}</f7-block>
  </f7-page>
</template>

<script setup>
defineProps({
  f7route: Object,
})
</script>

<style scoped>

</style>
