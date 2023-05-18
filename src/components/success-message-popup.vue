<template>
  <div class="success-popup-background" @click="emit('close')">
    <f7-block class="success-popup-body" @click.stop>
      <img class="close-icon" src="@/assets/icons/x.svg" alt="close" @click="emit('close')" />
      <f7-block-title>{{ title }}</f7-block-title>

      <p v-if="text">{{ text }}</p>

      <f7-button @click="emit('close')">{{ btnText || $t("popups.success-message-popup.got-it") }}</f7-button>
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
});

const emit = defineEmits(["appeared", "close"]);

onMounted(() => {
  emit("appeared");
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/success-message-popup";
</style>
