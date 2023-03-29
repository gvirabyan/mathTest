<template>
  <div
      :class="`circle ${status}`"
  >
    {{point}}
  </div>
</template>

<script setup>
const props = defineProps({
  point : Number,
  status: {
    type: String,
    default: 'normal',
    validator(value) {
      return ['active', 'true', 'false', 'skip', 'normal'].includes(value)
    }
  }
})
</script>

<style scoped lang="scss">
.circle {
  cursor: pointer;
  min-width: 40px;
  height: 40px;
  border-radius: 50%;
  font-family: 'Rubik';
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  &.skip, &.normal {
    color: #89838F;
    border: 2px solid #F0EBF5;
  }
  &.active {
    color: white;
    background: #212121;
  }
  &.false {
    color: #FF0000;
    border: 2px solid #FF0000;
  }
  &.true {
    color: #2EE56B;
    border: 2px solid #2EE56B;
  }
}
</style>