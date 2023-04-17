<template>
  <div class="loading-container">
    <div class="loading-block">
      <img width="101" height="87" src="@/assets/gifs/violet.gif" alt="Loading..." />
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss">
.loading-container {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%);
  display: grid;
  place-items: center;
  flex: 1;
}
</style>
