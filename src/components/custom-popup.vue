<template>
  <f7-popup class="custom-popup" :opened="isOpened">
    <f7-page>
      <div class="close-btn-wrapper display-flex justify-content-end">
        <f7-button class="close-btn" @click="closePopup">
          <img src="@/assets/icons/close.svg" alt="Close popup" />
        </f7-button>
      </div>

      <slot />
    </f7-page>
  </f7-popup>
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
.custom-popup {
  font-family: Rubik, sans-serif;

  &.notifications {
    width: 88%;
    right: 0;
    left: unset;
  }

  .page-content {
    padding: 24px;
    background-color: #fff;

    .close-btn {
      all: unset;
      display: grid;
      place-items: center;
      width: 12px;
      height: 12px;
    }
  }
}
</style>
