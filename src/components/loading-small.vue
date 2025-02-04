<template>
  <div class="loading-container">
    <div class="loading-block">
      <img width="101" height="87" src="@/assets/gifs/violet.gif" alt="Loading..." />
      <p class="loading-text"><slot /></p>
    </div>
  </div>
</template>

<style lang="scss">
.loading-container {
  display: grid;
  height: 100%;
  place-items: center;
  flex: 1;
}

.loading-block {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  align-items: center;
  text-align: center;
}

.loading-text {
  margin: 40px 0 0;
  font-size: 18px;
  line-height: 22px;
  white-space: pre-line;
}
</style>
