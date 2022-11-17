<template>
  <f7-page class="hg-home-page" name="home">
    <!-- Top Navbar -->
    <f7-navbar :sliding="false">
      <f7-nav-title sliding>Math</f7-nav-title>
    </f7-navbar>

    <f7-block>
      <f7-row>
        <h1 class="hg-welcome-message">Welcome to Math!</h1>
      </f7-row>

      <f7-row class="hg-actions-btns-content">
        <f7-button class="button button-outline button-round button-raised hg-default-btn-width"
                href="/login/"
        >Sign In</f7-button>

        <f7-button class="button button-outline button-round button-raised hg-default-btn-width"
                href="/register/"
        >Sign Up</f7-button>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
export default {
  name: "Home",
}
</script>

<style lang="scss">
.hg-home-page {
  .hg-welcome-message {
    margin: auto;
  }

  .hg-actions-btns-content {
    margin-top: 70px;
  }
}
</style>