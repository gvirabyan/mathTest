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
      return ["present", "correct", "wrong", "skip", "normal"].includes(value);
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

  &.present {
    color: white;
    border: 2px solid #212121;
    background: #212121;
  }

  &.wrong {
    color: #ff0000;
    border: 2px solid #ff0000;
  }

  &.correct {
    color: #2ee56b;
    border: 2px solid #2ee56b;
  }
}
</style>
