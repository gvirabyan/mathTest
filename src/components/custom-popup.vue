<template>
  <f7-panel v-model:opened="isOpened" right cover swipe swipe-only-close class="custom-popup">
    <f7-page>
      <header class="header">
        <div class="header-content-wrapper">
          <div class="close-btn-wrapper display-flex justify-content-end">
            <f7-button class="close-btn" @click="closePopup">
              <img src="@/assets/icons/close.svg" alt="Close popup" />
            </f7-button>
          </div>

          <slot name="title" />
        </div>
      </header>

      <slot name="content" />
    </f7-page>
  </f7-panel>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpenedInitial: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close-popup"]);

const isOpened = ref(props.isOpenedInitial);

const closePopup = () => {
  isOpened.value = false;
  emit("close-popup");
};

watch(
  () => props.isOpenedInitial,
  val => {
    isOpened.value = val;
  },
);
</script>

<style lang="scss">
@import "@/assets/scss/components/custom-popup";
</style>
