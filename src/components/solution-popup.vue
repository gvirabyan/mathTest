<template>
  <f7-block>
    <iframe
      id="solution-iframe"
      :src="`https://schulmatheapp.de/solution.php?questionID=${questionID}&categoryName=${categoryName}`"
      style="width: 100%; border: none"
    ></iframe>
  </f7-block>
</template>

<script setup>
const props = defineProps({
  questionID: {
    type: Number,
    default: 0,
  },
  categoryName: {
    type: String,
    default: "",
  },
});
window.addEventListener(
  "message",
  function (event) {
    const iframe = document.getElementById("solution-iframe");
    console.log(event.data);
    if (iframe && event.data) {
      iframe.style.height = event.data + 60 + "px";
    }
  },
  false,
);
</script>
<style lang="scss"></style>
