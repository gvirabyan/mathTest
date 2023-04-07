<template>
  <div class="my-status">
    <h2 class="title">Last quiz</h2>

    <f7-block class="last-quiz">
      <h3 class="last-quiz-name">Reihenfolge der Operationen, drei ganze Zahlen</h3>
      <p class="last-quiz-stats">14/32</p>
    </f7-block>

    <f7-block class="experience">
      <h3 class="experience-title">Experience points</h3>
      <p class="experience-update">Last update: 18 days 22 h ago</p>
      <div class="experience-points-wrapper">
        <p class="experience-points">1672</p>
      </div>
      <p class="experience-time">You are in Math App <span class="value">1 month 38 days</span></p>
    </f7-block>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  console.log("my status");
});
</script>

<style lang="scss">
@import "@/assets/scss/components/activity-my-status";
</style>
