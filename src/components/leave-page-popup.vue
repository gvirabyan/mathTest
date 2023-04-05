<template>
  <div class="leave-popup-background">
    <f7-block class="leave-popup-body">
      <img class="close-icon" src="@/assets/icons/x.svg" >
      <f7-block-title>
        Are you sure you want to leave this page?
      </f7-block-title>
      <p>
        If you leave this page your edited information will be removed
      </p>
      <f7-row>
        <f7-button>Leave</f7-button>
        <f7-button>Save</f7-button>
      </f7-row>
    </f7-block>
  </div>
</template>

<style lang="scss" scoped>
.leave-popup-background {
  position: fixed;
  z-index: 80;
  height: 100vh;
  width: 100%;
  background: rgba(33, 33, 33, 0.7);
  .leave-popup-body {
    padding: 30px;
    width: 342px;
    border-radius: 8px;
    background: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .close-icon {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
}
</style>