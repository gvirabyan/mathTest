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

<script setup>
import {defineProps, reactive} from 'vue';
import { useAuthStore } from '@/js/stores/auth';

const props = defineProps({
  f7route: Object,
  f7router: Object
});

const userData = reactive({
  identifier: null,
  password: null
})

const { login } = useAuthStore();

const startLogin = () => {
  login(userData).then(resp => {
    if (resp.status === 'success') {
      props.f7router.navigate('/dashboard/')
    } else {
      alert(resp.message);
      console.error(resp.message);
    }
  })
}
</script>
