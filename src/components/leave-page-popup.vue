<template>
  <div class="leave-popup-background" @click="emit('close')">
    <f7-block class="leave-popup-body" @click.stop>
      <img class="close-icon" src="@/assets/icons/x.svg" alt="close" @click="emit('close')" />

      <f7-block-title>
        <span v-html="$sanitize(title)" />
      </f7-block-title>

      <p v-html="$sanitize(text)" />

      <f7-row>
        <f7-button class="leave-btn" @click="emit('leave-changes')">
          {{ leaveBtn }}
        </f7-button>
        <f7-button class="save-btn" @click="emit('save-changes')">
          {{ saveBtn }}
        </f7-button>
      </f7-row>
    </f7-block>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: ` Are you sure you want <br> to leave this page?`,
  },
  text: {
    type: String,
    default: `If you leave this page your edited <br> information will be removed`,
  },
  saveBtn: {
    type: String,
    default: "Save",
  },
  leaveBtn: {
    type: String,
    default: "Leave",
  },
});

const emit = defineEmits(["leave-changes", "save-changes", "close"]);
</script>

<style lang="scss" scoped>
@import "@/assets/scss/components/leave-page-popup";
</style>
