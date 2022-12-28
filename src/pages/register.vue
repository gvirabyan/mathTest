<template>
  <f7-page class="hg-register-page" login-screen>
    <f7-login-screen-title>Register</f7-login-screen-title>

    <f7-block inset>
      <f7-segmented raised>
        <f7-button
          :active="registerMode === 'credentials'"
          @click="registerMode = 'credentials'"
        >Email/password</f7-button>
        <f7-button
          :active="registerMode === 'nickname'"
          @click="registerMode = 'nickname'"
        >Nickname only</f7-button>
      </f7-segmented>
    </f7-block>

    <f7-list form>
      <template v-if="registerMode === 'credentials'">
        <f7-list-input
          type="text"
          name="nickname"
          placeholder="Nickname"
          v-model:value="userData.nickname"
        ></f7-list-input>

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
      </template>

      <template v-else-if="registerMode === 'nickname'">
        <f7-list-input
          type="text"
          name="nickname"
          placeholder="Nickname"
          v-model:value="userData.nickname"
        ></f7-list-input>
      </template>
    </f7-list>

    <f7-block>
      <f7-button
        class="button button-fill button-round button-raised button-large"
        @click="startRegister"
      >Sign Up
      </f7-button>
    </f7-block>

    <f7-block-footer>
      <br><a href="/login/">Sign In</a> if you already have an account
    </f7-block-footer>

    <f7-block-footer>
      <br>Click <a href="/">here</a> to back Main page
    </f7-block-footer>
  </f7-page>
</template>

<script setup>
import {f7} from 'framework7-vue';
import {reactive, ref} from 'vue';
import {useAuthStore} from '@/js/stores/auth';

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const userData = reactive({
  nickname: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const {register, registerByNickname} = useAuthStore();

const registerMode = ref('credentials')

const startRegister = () => {
  if (registerMode.value === 'nickname') {
    registerByNickname({
      nickname: userData.nickname
    }).then(resp => {
      if (resp.status === 'success') {
        props.f7router.navigate('/dashboard/');
        return;
      }

      f7.toast.show({
        text: resp.message,
        closeButton: true
      });
    });

    return;
  }

  if (userData.password === userData.confirmPassword) {
    register({
      nickname: userData.nickname,
      username: userData.email,
      email: userData.email,
      password: userData.password,
    }).then(resp => {
      if (resp.status === 'success') {
        props.f7router.navigate('/dashboard/');
        return;
      }

      f7.toast.show({
        text: resp.message,
        closeButton: true
      });
    });

    return;
  }

  f7.toast.show({
    text: 'Password and password confirmation should match',
    closeButton: true
  });
};
</script>
