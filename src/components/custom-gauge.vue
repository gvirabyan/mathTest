<template>
  <svg :height="`${radius * 2}`" :width="`${radius * 2}`">
    <circle class="gauge_base" :cx="radius" :cy="radius" fill="transparent" :r="radius" stroke="gray" />
  </svg>
</template>

<script setup>
const props = defineProps({
  radius: {
    type: Number,
    required: true,
    default: 0,
  },
});
</script>

<style lang="scss" scoped></style>
