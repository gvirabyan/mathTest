<template>
  <div class="input-popup-background" @click="emit('close')">
    <f7-block class="input-popup-body" @click.stop>
      <img class="close-icon" src="@/assets/icons/x.svg" alt="close" @click="emit('close')" />

      <f7-block-title>
        <span>{{ $t("popups.input-popup.title") }}</span>
      </f7-block-title>

      <f7-input
        v-model:value="result"
        type="text"
        name="result"
        inputmode="numeric"
        :input-style="inputStyle"
        class="custom-list-input"
        :error-message-force="!!error"
        :error-message="error"
        :placeholder="$t('inputs.enter-the-result')"
      />

      <f7-row>
        <f7-button class="save-btn" :class="sendBtnClass" :disabled="!result || isSending" @click="sendResultHandler">
          {{ $t("buttons.send") }}
        </f7-button>
      </f7-row>
    </f7-block>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps({
  sendBtnClass: {
    type: String,
    default: "",
    validator(value) {
      return ["", "correct", "wrong"].includes(value);
    },
  },
  isSending: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["input-answer", "close"]);

const inputStyle = {
  padding: "0px",
  fontFamily: "Rubik",
  fontSize: "16px",
  height: "unset",
  position: "relative",
};

const result = ref(null);
const error = ref("");

const sendResultHandler = () => {
  const hasNumbersOnly = /^\d+$/.test(result.value);

  if (!hasNumbersOnly) {
    error.value = `${t("popups.input-popup.error")}`;
    return;
  }

  emit("input-answer", result.value);
};

watch(result, () => {
  error.value = "";
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/components/input-popup.scss";
</style>
