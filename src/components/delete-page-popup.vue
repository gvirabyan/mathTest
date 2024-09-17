<template>
  <div class="leave-popup-background" @click="emit('cancel-changes')">
    <f7-block class="leave-popup-body" @click.stop>
      <img class="close-icon" src="@/assets/icons/x.svg" alt="close" @click="emit('cancel-changes')" />

      <f7-block-title>
        <span
          v-html="
            $sanitize(
              title ||
                `${$t('popups.delete-page-popup.first-title')}  <br> ${$t('popups.delete-page-popup.second-title')}`,
            )
          "
        />
      </f7-block-title>

      <p
        v-html="
          $sanitize(
            text || `${$t('popups.delete-page-popup.first-text')}  <br> ${$t('popups.delete-page-popup.second-text')}`,
          )
        "
      />

      <f7-row>
        <f7-button class="leave-btn" @click="emit('cancel-changes')">
          {{ leaveBtn || $t("popups.delete-page-popup.cancel") }}
        </f7-button>
        <f7-button class="save-btn" @click="emit('delete-changes')">
          {{ saveBtn || $t("popups.delete-page-popup.delete") }}
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

const emit = defineEmits(["cancel-changes", "delete-changes"]);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/leave-page-popup";
</style>
