<template>
  <div class="profile-security">
    <f7-list form>

      <f7-list-input
          v-model:value="userData.oldPassword"
          :type="showOldPassword ? 'text' : 'password'"
          name="password"
          :input-style="inputStyle"
          class="custom-list-input"
          :error-message-force="!!error.oldPassword"
          :error-message="error.oldPassword"
          label="Your password"
      >
        <template #media>
          <div class="eye-icons" @click="showOldPassword = !showOldPassword">
            <img v-if="showOldPassword" src="@/assets/icons/eye.svg" alt="eye" />
            <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
          </div>
        </template>
      </f7-list-input>

      <f7-list-input
          v-model:value="userData.password"
          :type="showPassword ? 'text' : 'password'"
          name="password"
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
          v-model:value="userData.newPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          name="password"
          class="custom-list-input"
          :error-message-force="!!error.newPassword"
          :error-message="error.newPassword"
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
import { useAuthStore } from "@/js/stores/auth";

const showPassword = ref(false);
const showOldPassword = ref(false);
const showConfirmPassword = ref(false);

const userData = reactive({
  oldPassword: "",
  password: "",
  NewPassword: ""
})

const error = reactive({
  oldPassword: "",
  password: "",
  NewPassword: ""
})

const btnDisabled = computed(() => !(userData.oldPassword && userData.password && userData.newPassword));

const startLogin = () => {

};

</script>

<style lang="scss">
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/pages/security.scss";
</style>
