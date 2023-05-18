<template>
  <div class="leave-popup-background" @click="emit('close')">
    <f7-block class="leave-popup-body" @click.stop>
      <img class="close-icon" src="@/assets/icons/x.svg" alt="close" @click="emit('close')" />

      <f7-block-title>
        <span
          v-html="
            $sanitize(
              title ||
                `${$t('popups.leave-page-popup.first-title')}  <br> ${i18n.t('popups.leave-page-popup.second-title')}`,
            )
          "
        />
      </f7-block-title>

      <p
        v-html="
          $sanitize(
            text || `${$t('popups.leave-page-popup.first-text')}  <br> ${$t('popups.leave-page-popup.second-text')}`,
          )
        "
      />

      <f7-row>
        <f7-button class="leave-btn" @click="emit('leave-changes')">
          {{ leaveBtn || $t("popups.leave-page-popup.leave") }}
        </f7-button>
        <f7-button class="save-btn" @click="emit('save-changes')">
          {{ saveBtn || $t("popups.leave-page-popup.save") }}
        </f7-button>
      </f7-row>
    </f7-block>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  saveBtn: {
    type: String,
    default: "",
  },
  leaveBtn: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["leave-changes", "save-changes", "close"]);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/leave-page-popup";
</style>
