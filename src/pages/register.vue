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

<script setup>
import {reactive} from 'vue';
import {useAuthStore} from '@/js/stores/auth';

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const userData = reactive({
  email: null,
  password: null,
  confirmPassword: null,
});

const { register } = useAuthStore();

const startRegister = () => {
  if (userData.password === userData.confirmPassword) {
    register({
      username: userData.email,
      email: userData.email,
      password: userData.password,
    }).then(resp => {
      if (resp.status === 'success') {
        props.f7router.navigate('/dashboard/')
      } else {
        alert(resp.message);
        console.error(resp.message);
      }
    });
  }
}
</script>
