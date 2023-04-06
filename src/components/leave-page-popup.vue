<template>
  <div class="leave-popup-background">
    <f7-block class="leave-popup-body">
      <img class="close-icon" src="@/assets/icons/x.svg" >
      <f7-block-title>
        Are you sure you want <br> to leave this page?
      </f7-block-title>
      <p>
        If you leave this page your edited <br> information will be removed
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
  z-index: 91;
  height: 100vh;
  width: 100%;
  background: rgba(33, 33, 33, 0.7);
  .leave-popup-body {
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
      margin: 0;
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 600;
      font-size: 18px;
      line-height: 21px;
      text-align: center;
      color: #212121;
    }
    p {
      font-family: 'Rubik';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 17px;
      text-align: center;
      color: #212121;
      margin: 10px 0;
    }
    .close-icon {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
}
</style>