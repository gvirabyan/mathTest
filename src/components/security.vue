<template>
  <div class="profile-security">
    <f7-list form>

      <f7-list-input
          v-model:value="userData.password"
          :type="showOldPassword ? 'text' : 'password'"
          name="password"
          :input-style="inputStyle"
          class="custom-list-input"
          :error-message-force="!!error.password"
          :error-message="error.password"
          label="Your password"
      >
        <template #media>
          <div class="eye-icons" @click="showOldPassword = !showOldPassword">
            <img v-if="showPassword" src="@/assets/icons/eye.svg" alt="eye" />
            <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
          </div>
        </template>
      </f7-list-input>

      <f7-list-input
          v-model:value="userData.password"
          :type="showPassword ? 'text' : 'password'"
          name="password"
          :input-style="inputStyle"
          class="custom-list-input"
          :error-message-force="!!error.password"
          :error-message="error.password"
          label="New password"
      >
        <template #media>
          <div class="eye-icons" @click="showPassword = !showPassword">
            <img v-if="showPassword" src="@/assets/icons/eye.svg" alt="eye" />
            <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
          </div>
        </template>
      </f7-list-input>

      <f7-list-input
          v-model:value="userData.showConfirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          name="password"
          :input-style="inputStyle"
          class="custom-list-input"
          :error-message-force="!!error.password"
          :error-message="error.password"
          label="Confirm new password"
      >
        <template #media>
          <div class="eye-icons" @click="showConfirmPassword = !showConfirmPassword">
            <img v-if="showConfirmPassword" src="@/assets/icons/eye.svg" alt="eye" />
            <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
          </div>
        </template>
      </f7-list-input>

      <f7-block class="save-btn-block">
        <f7-button
            :class="{
            'button-save button-large': true,
            'button-fill': !btnDisabled,
            'button-disabled-fill': btnDisabled,
          }"
            @click="startLogin"
        >
          Save
        </f7-button>
      </f7-block>

    </f7-list>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { f7 } from "framework7-vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import fbHandler from "@/js/handlers/fb-handler";

const showPassword = ref(false);
const showOldPassword = ref(false);
const showConfirmPassword = ref(false);

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const { suggestedCredentials } = storeToRefs(useAuthStore());
const { login, loginViaProvider } = useAuthStore();

const rememberUser = ref(false);
const remember = ref(false);

const userData = reactive({
  identifier: "",
  password: "",
});

const error = reactive({
  identifier: "",
  password: "",
});

const inputStyle = reactive({
  padding: "0px",
  fontFamily: "Rubik",
  fontSize: "16px",
  height: "unset",
  position: "relative",
});

const btnDisabled = computed(() => !(userData.password && userData.identifier));

const startLogin = () => {
  login(userData, rememberUser.value).then(resp => {
    if (resp.status === "success") {
      props.f7router.navigate("/activity/");
    } else {
      error.identifier = "";
      error.password = "";
      if (resp.error.details.errors) {
        resp.error.details.errors.forEach(err => {
          error[err.path[0]] = err.message;
        });
      } else {
        f7.toast.show({
          text: resp.error.message,
          closeButton: true,
        });
      }
    }
  });
};

const fbLoginHandler = async function () {
  await fbHandler.login().then(response => {
    if (response.authResponse) {
      loginViaProvider("facebook", `?access_token=${response.authResponse.accessToken}`).then(resp => {
        if (resp.status === "success") {
          props.f7router.navigate("/activity/");
          return;
        }

        f7.toast.show({
          text: resp.error.message,
          closeButton: true,
        });
      });
    } else {
      alert("User cancelled login or did not fully authorize.");
    }
  });
};

userData.identifier = suggestedCredentials.value.suggestedLogin;
userData.password = suggestedCredentials.value.suggestedPassword;
</script>

<style lang="scss">
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/pages/security.scss";
</style>
