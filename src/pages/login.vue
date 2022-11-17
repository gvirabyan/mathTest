<template>
  <f7-page class="hg-login-page" login-screen>
    <f7-login-screen-title>Login</f7-login-screen-title>
    <f7-list form>
      <f7-list-input
          type="text"
          name="email"
          placeholder="Your email"
          v-model:value="userData.identifier"
      ></f7-list-input>

      <f7-list-input
          type="password"
          name="password"
          placeholder="Your password"
          v-model:value="userData.password"
      ></f7-list-input>

      <f7-block>
        <f7-row class="justify-content-end">
          <f7-link href="/forgot-password">Forgot password?</f7-link>
        </f7-row>
      </f7-block>
    </f7-list>

    <f7-list>
      <f7-block>
        <f7-button class="button button-fill button-round button-raised button-large"
                   @click="startLogin"
        >Sign In</f7-button>

        <f7-block-footer>
          <br><a href="/register/">Sign Up</a> if you don't have an account yet
        </f7-block-footer>

        <f7-block-footer>
          <br>Click <a href="/">here</a> to back Main page
        </f7-block-footer>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script>
import store from "../js/store";

export default {
  name: "Login",
  props: {
    f7route: Object,
    f7router: Object
  },
  data() {
    return {
      userData: {
        identifier: null,
        password: null
      }
    }
  },
  methods: {
    startLogin() {
      store.dispatch('login', {
        identifier: this.userData.identifier,
        password: this.userData.password,
      }).then(resp => {
        if (resp.status === 'success') {
          this.f7router.navigate('/dashboard/')
        } else {
          console.error(resp.message);
        }
      });
    }
  }
}
</script>