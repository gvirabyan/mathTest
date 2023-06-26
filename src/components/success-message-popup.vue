<template>
  <div class="success-popup-background" @click="emit('close')">
    <f7-block class="success-popup-body" @click.stop>
      <p v-if="date" class="success-popup-date">{{ date }}</p>
      <button class="close-icon" @click="emit('close')">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.7"
            d="M6 7.09086L1.09086 12L0 10.9086L4.90857 6L0 1.09086L1.09086 0L6 4.90857L10.9086 0L12 1.09086L7.09086 6L12 10.9086L10.9086 12L6 7.09086Z"
            fill="#212121"
          />
        </svg>
      </button>

      <f7-block-title>{{ title }}</f7-block-title>

      <p v-if="text">{{ text }}</p>

      <f7-button @click="emit('close')">{{ btnText || $t("popups.success-message-popup.got-it") }}</f7-button>
      <f7-button v-if="secondBtnText" @click="emit('second-button-event')">{{ secondBtnText }}</f7-button>
    </f7-block>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

defineProps({
  text: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  btnText: {
    type: String,
    default: "",
  },
  date: {
    type: [String, null],
    default: null,
  },
  secondBtnText: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["appeared", "close"]);

onMounted(() => {
  emit("appeared");
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/success-message-popup";
</style>
