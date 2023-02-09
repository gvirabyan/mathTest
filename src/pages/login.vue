<template>
  <f7-page class="hg-login-page" login-screen>
    <f7-login-screen-title>Login</f7-login-screen-title>
    <f7-list form>
      <f7-list-input
        v-model:value="userData.identifier"
        type="text"
        name="email"
        placeholder="Your email"
      ></f7-list-input>

      <f7-list-input
        v-model:value="userData.password"
        type="password"
        name="password"
        placeholder="Your password"
      ></f7-list-input>

      <f7-block>
        <f7-row class="justify-content-end">
          <f7-link href="/forgot-password">Forgot password?</f7-link>
        </f7-row>
      </f7-block>
    </f7-list>

    <f7-list>
      <f7-block>
        <f7-button class="button button-fill button-round button-raised button-large" @click="startLogin"
          >Sign In</f7-button
        >

        <f7-block-footer> <br /><a href="/register/">Sign Up</a> if you don't have an account yet </f7-block-footer>

        <f7-block-footer> <br />Click <a href="/">here</a> to back Main page </f7-block-footer>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { reactive } from "vue";
import { useAuthStore } from "@/js/stores/auth";
import { f7 } from "framework7-vue";

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const userData = reactive({
  identifier: "",
  password: "",
});

const { login } = useAuthStore();

const startLogin = () => {
  login(userData).then(resp => {
    if (resp.status === "success") {
      props.f7router.navigate("/dashboard/");
    } else {
      f7.toast.show({
        text: resp.message,
        closeButton: true,
      });
    }
  });
};
</script>
