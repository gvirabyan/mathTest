<template>
  <f7-page class="hg-register-page" login-screen>
    <f7-login-screen-title>Register</f7-login-screen-title>
    <f7-list form>
      <f7-list-input
          type="text"
          name="email"
          placeholder="E-mail"
          v-model:value="userData.email"
      ></f7-list-input>

      <f7-list-input
          type="password"
          name="password"
          placeholder="Password"
          v-model:value="userData.password"
      ></f7-list-input>

      <f7-list-input
          type="password"
          name="password"
          placeholder="Confirm password"
          v-model:value="userData.confirmPassword"
      ></f7-list-input>
    </f7-list>

    <f7-list>
      <f7-block>
        <f7-button class="button button-fill button-round button-raised button-large"
                   @click="startRegister"
        >Sign Up</f7-button>
      </f7-block>

      <f7-block-footer>
        <br><a href="/login/">Sign In</a> if you already have an account
      </f7-block-footer>

      <f7-block-footer>
        <br>Click <a href="/">here</a> to back Main page
      </f7-block-footer>
    </f7-list>
  </f7-page>
</template>

<script>
import store from "../js/store";

export default {
  name: "Register",
  props: {
    f7route: Object,
    f7router: Object,
  },
  data() {
    return {
      userData: {
        email: null,
        password: null,
        confirmPassword: null,
      }
    }
  },
  methods: {
    startRegister() {
      if (this.userData.password === this.userData.confirmPassword) {
        store.dispatch('register', {
          username: this.userData.email,
          email: this.userData.email,
          password: this.userData.password,
        }).then(resp => {
          if (resp.status === 'success') {
            this.f7router.navigate('/dashboard/')
          } else {
            alert(resp.message);
            console.error(resp.message);
          }
        });
      }
    },
  }
}
</script>