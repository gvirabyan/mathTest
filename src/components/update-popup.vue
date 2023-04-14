<template>
  <div @click="$emit('close')" class="update-popup-background">
    <f7-block @click.stop class="update-popup-body">
      <img class="close-icon"
           @click="$emit('close')"
           src="@/assets/icons/x.svg"
      >
      <f7-block-title>
        {{title}}
      </f7-block-title>
      <f7-list form>
        <f7-list-input
          v-model:value="input"
          type="text"
          class="custom-list-input"
          placeholder="E-mail address"
          :error-message-force="true"
          :error-message="error"
        />
        <f7-button @click="$emit('save', input)">Got it</f7-button>
      </f7-list>
    </f7-block>
  </div>
</template>

<script setup>
import {onMounted, ref} from "vue";

const props = defineProps({
  inputValue: {
    type: String,
  },
  title: {
    type: String,
    default: 'Please enter E-mail <br> to complete registration.'
  },
  error: {
    type: String,
    default: ''
  }
})

const input = ref('')
onMounted(
  () => {
    input.value = props.inputValue
  }
)

</script>

<style lang="scss">
.update-popup-background {
  position: fixed;
  z-index: 95;
  height: 100vh;
  width: 100%;
  background: rgba(33, 33, 33, 0.7);
  .update-popup-body {
    padding: 30px 20px;
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

    .list {
      margin: 30px 0 0 0 !important;
      ul {
        &:before {
          display: none !important;
        }
        &:after {
          display: none !important;
        }
        .custom-list-input {
          height: 50px;
          .item-content {
            padding-left: 0 ;
          }
          .item-inner {
            margin: 0;
            input {
              height: 20px !important;
              padding-bottom: 5px;
            }
            padding: 0 !important;
            &:after {
              display: none;
              background: #E4E4E4 !important;
            }
            .item-label {
              font-family: 'Rubik';
              font-style: normal;
              font-weight: 300;
              font-size: 12px;
              line-height: 14px;
              color: #212121;
            }
          }
          .item-input-wrap {
            height: 50px;

            &.item-input-focused {
            }

            &:after {
              content: "";
              display: block;
              position: absolute;
              transform: unset !important;
              bottom: 24px !important;
              width: 100% !important;
              height: 0.9px !important;
              background: #E4E4E4 !important;
            }

            .item-input-error-message {
              position: absolute !important;
              bottom: 2px;
              top: unset;
              height: 16px;
              width: 100%;
            }
          }
        }
      }
    }
    .close-icon {
      position: absolute;
      top: 15px;
      right: 15px;
    }
    .button {
      text-transform: unset;
      padding: 10px;
      margin-top: 6px;
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