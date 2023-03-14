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

      <f7-list-item v-model:checked="rememberUser" checkbox title="Remember me" name="remember" />

      <f7-block>
        <f7-row class="justify-content-end">
          <f7-link href="/forgot-password/">Forgot password?</f7-link>
        </f7-row>
      </f7-block>
    </f7-list>

    <f7-list>
      <f7-block>
        <f7-button class="button button-fill button-round button-raised button-large" @click="startLogin"
          >Sign In</f7-button
        >

        <a :href="`${backendUrl}connect/facebook`" class="link external"> Facebook </a>

        <f7-block-footer> <br /><a href="/register/">Sign Up</a> if you don't have an account yet </f7-block-footer>

        <f7-block-footer> <br />Click <a href="/">here</a> to back Main page </f7-block-footer>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { f7 } from "framework7-vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const backendUrl = import.meta.env.VITE_API_URL;

const userData = reactive({
  identifier: "",
  password: "",
});

const { suggestedCredentials } = storeToRefs(useAuthStore());
const rememberUser = ref(false);

const { login } = useAuthStore();

const startLogin = () => {
  login(userData, rememberUser.value).then(resp => {
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

const startFbLogin = async () => {
  const res = await fetch(`${backendUrl}connect/facebook`);
  console.log(res);
};

userData.identifier = suggestedCredentials.value.suggestedLogin;
userData.password = suggestedCredentials.value.suggestedPassword;
</script>
