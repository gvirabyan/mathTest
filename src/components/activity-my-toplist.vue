<template>
  <div class="activity-tab-content">My Top List</div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  console.log("my top list");
});
</script>

<style lang="scss">
.activity-tab-content {
  flex: 1;
}
</style>
