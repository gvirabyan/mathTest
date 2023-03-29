<template>
  <div :class="`circle ${status}`">
    {{ point }}
  </div>
</template>

<script setup>
defineProps({
  point: { type: Number, default: 0 },
  status: {
    type: String,
    default: "normal",
    validator(value) {
      return ["active", "true", "false", "skip", "normal"].includes(value);
    },
  },
});
</script>

<style lang="scss" scoped>
.circle {
  cursor: pointer;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  font-family: "Rubik", sans-serif;
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &.skip,
  &.normal {
    color: #89838f;
    border: 2px solid #f0ebf5;
  }

  &.active {
    color: white;
    background: #212121;
  }

  &.false {
    color: #ff0000;
    border: 2px solid #ff0000;
  }

  &.true {
    color: #2ee56b;
    border: 2px solid #2ee56b;
  }
}
</style>
