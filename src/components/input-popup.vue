<template>
  <div class="input-popup-background" @click="emit('close')">
    <f7-block class="input-popup-body" @click.stop>
      <img class="close-icon" src="@/assets/icons/x.svg" alt="close" @click="emit('close')" />

      <f7-block-title>
        <span>{{ $t("popups.input-popup.title") }}</span>
      </f7-block-title>

      <f7-input
        ref="resultInput"
        v-model:value="result"
        type="number"
        name="result"
        inputmode="numeric"
        :input-style="inputStyle"
        class="custom-list-input"
        :error-message-force="!!error"
        :error-message="error"
        :placeholder="$t('inputs.enter-the-result')"
      />

      <p>{{ firstAnswer }}</p>

      <f7-row>
        <f7-button class="save-btn" :class="sendBtnClass" :disabled="!result || isSending" @click="inputPopupBtnClick">
          {{ inputPopupBtnText }}
        </f7-button>
      </f7-row>
    </f7-block>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";

const i18n = useI18n();

const props = defineProps({
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
  isSent: {
    type: Boolean,
    default: false,
  },
  firstAnswer: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["input-answer", "go-next", "close"]);

const inputStyle = {
  padding: "0px",
  fontFamily: "Rubik",
  fontSize: "16px",
  height: "unset",
  position: "relative",
};
const resultInput = ref(null);
const result = ref(null);
const error = ref("");

const inputPopupBtnText = computed(() => (!props.isSent ? i18n.t("buttons.send") : i18n.t("buttons.next")));

const focusInput = () => {
  const resultInputEl = resultInput.value.$el.querySelector("input");
  resultInputEl.focus();
};

const sendResultHandler = () => {
  emit("input-answer", result.value);
};

const inputPopupBtnClick = () => {
  if (!props.isSent) {
    sendResultHandler();
    return;
  }

  emit("go-next");
};

watch(result, () => {
  error.value = "";
});

onMounted(() => {
  focusInput();
});
</script>

<style scoped lang="scss">
@import "@/assets/scss/components/input-popup.scss";
</style>
