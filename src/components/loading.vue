<template>
  <div class="loading-page">
    <img class="points-right" src="@/assets/images/pointsRight.svg" alt="" />
    <img class="points-left" src="@/assets/images/pointsLeft.svg" alt="" />
    <div class="loading-block">
      <img width="50" src="@/assets/gifs/gray.gif" alt="Loading" />
      <f7-block-title> <span class="special-word">Mathe </span> App </f7-block-title>
    </div>
  </div>
</template>

<style scoped lang="scss">
.loading-page {
  height: 100vh;
  background: #212121;
  position: fixed;
  width: 100%;
  padding: 0;
  top: 0;
  left: 0;
  z-index: 5001;
  .points-left {
    position: absolute;
    width: 60vw;
    bottom: 0;
    left: 0;
  }
  .points-right {
    position: absolute;
    width: 60vw;
    top: 0;
    right: 0;
  }
  .loading-block {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    img {
      position: absolute;
      left: 50%;
      top: -40px;
      transform: translateX(-50%);
    }
    .block-title {
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: unset !important;
      font-family: "Rubik", sans-serif;
      color: white;
      font-size: 35px;
      .special-word {
        color: #8419ff;
      }
    }
  }
}
</style>
