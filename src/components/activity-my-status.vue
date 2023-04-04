<template>
  <div class="activity-tab-content">My Status</div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  console.log("my status");
});
</script>

<style lang="scss">
.activity-tab-content {
  flex: 1;
}
</style>
