<template>
  <div @click="$emit('close')" class="success-popup-background">
    <f7-block @click.stop class="success-popup-body">
      <img class="close-icon"
          @click="$emit('close')"
          src="@/assets/icons/x.svg"
      >
      <f7-block-title>
        {{title}}
      </f7-block-title>
      <p v-if="text">
        {{text}}
      </p>
      <f7-button @click="$emit('close')">Got it</f7-button>
    </f7-block>
  </div>
</template>

<script setup>
 const props = defineProps({
   text: {
     type: String,
     default: ''
   },
   title: {
     type: String,
     default: ''
   }
 })

</script>

<style lang="scss" scoped>
.success-popup-background {
  position: fixed;
  z-index: 95;
  height: 100vh;
  width: 100%;
  background: rgba(33, 33, 33, 0.7);
  .success-popup-body {
    padding: 30px;
    width: 342px;
    border-radius: 8px;
    background: #fff;
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .block-title {
      overflow: unset;
      text-overflow: unset;
      white-space: unset;
      margin: 0;
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 21px;
      text-align: center;
      color: #212121;
    }
    .close-icon {
      position: absolute;
      top: 15px;
      right: 15px;
    }
    .button {
      text-transform: unset;
      margin-top: 30px;
      padding: 10px;
      width: 100%;
      background: #8419FF;
      border-radius: 6px;
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      display: flex;
      align-items: center;
      text-align: center;
      color: #FFFFFF;
    }
  }
}
</style>