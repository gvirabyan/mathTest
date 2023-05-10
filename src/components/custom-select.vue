<template>
  <div class="custom-select" @blur="toggleSelect">
    <div :class="{ isOpened: isOpened }" class="selected" @click="toggleSelect">
      {{ selected }}
    </div>

    <div :class="{ 'select-hide': !isOpened }" class="items">
      <div
        v-for="(option, i) of options"
        :key="i"
        :class="{ selected: option === selected }"
        class="item"
        @click="clickSelectItem(option)"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  default: {
    type: String,
    required: false,
    default: null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["input:selected"]);

const isOpened = ref(false);
const selected = ref(null);

const toggleSelect = () => {
  if (props.disabled) return;

  isOpened.value = !isOpened.value;
};
const clickSelectItem = option => {
  selected.value = option;
  isOpened.value = false;
  emit("input:selected", option);
};

watch(
  () => props.default,
  value => {
    selected.value = value;
  },
);

onMounted(() => {
  selected.value = props.default ? props.default : props.options.length > 0 ? props.options[0] : null;
});
</script>

<style lang="scss">
@import "@/assets/scss/components/custom-select";
</style>
