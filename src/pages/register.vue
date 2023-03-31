<template>
  <f7-page class="hg-register-page" login-screen>
    <f7-login-screen-title>Sign Up</f7-login-screen-title>

    <f7-block inset>
      <f7-segmented raised>
        <f7-button
            :class="{
            'active-segment': registerMode === 'credentials'
          }"
            :active="registerMode === 'credentials'"
            @click="registerMode = 'credentials'"
        >
          Registration
        </f7-button
        >
        <f7-button
            :class="{
            'active-segment': registerMode === 'nickname'
          }"
            :active="registerMode === 'nickname'"
            @click="registerMode = 'nickname'"
        >
          Only nickname
        </f7-button>
      </f7-segmented>
    </f7-block>

        <f7-list form>
          <template v-if="registerMode === 'credentials'">
            <f7-list-input
                v-model:value="userData.username"
                type="text"
                name="username"
                :input-style="inputStyle"
                class="custom-list-input"
                :error-message-force="!!error.username"
                :error-message="error.username"
                placeholder="Nickname"
            ></f7-list-input>

            <f7-list-input
                v-model:value="userData.email"
                type="text"
                name="email"
                :input-style="inputStyle"
                class="custom-list-input"
                :error-message-force="!!error.email"
                :error-message="error.email"
                placeholder="E-mail"
            ></f7-list-input>

            <f7-list-input
                v-model:value="userData.password"
                :type="showPassword ? 'text' : 'password'"
                name="password"
                :input-style="inputStyle"
                class="custom-list-input"
                :error-message-force="!!error.password"
                :error-message="error.password"
                placeholder="Password"
            >
              <template #media>
                <div class="eye-icons" @click="showPassword = !showPassword">
                  <img v-if="showPassword" src="@/assets/icons/eye.svg" alt="eye" />
                  <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
                </div>
              </template>
            </f7-list-input>

            <div class="radio-block" @click="remember = !remember">
              <div class="radio-round">
                <div v-if="remember" class="radio-circle" />
              </div>
              <span class="radio-text">Remember me</span>
            </div>

          </template>

          <template v-else-if="registerMode === 'nickname'">
            <f7-list-input
                v-model:value="userData.username"
                type="text"
                name="username"
                :input-style="inputStyle"
                class="custom-list-input"
                :error-message-force="!!error.username"
                :error-message="error.username"
                placeholder="Nickname"
            ></f7-list-input>
          </template>

          <f7-button
              :class="{
          'button button-raised button-large': true,
          'button-margin': registerMode === 'credentials',
          'button-minimal-margin': registerMode === 'nickname',
          'button-fill': !btnDisabled,
          'button-disabled-fill': btnDisabled,
        }"
              @click="startRegister"
          >
            Sign Up
          </f7-button>
          <p class="error-message">{{error.message}}</p>
        </f7-list>

    <f7-list class="f7-footer">
      <f7-block class="f7-content-title">
        <div class="f7-line" />
        <p class="f7-content-title-text">Sign Up using</p>
        <div class="f7-line" />
      </f7-block>

      <f7-block class="f7-content-btn">
        <f7-row class="justify-content-space-between">
          <f7-button class="f7-btn">Google</f7-button>
          <f7-button class="f7-btn" @click="fbLoginHandler">Facebook</f7-button>
        </f7-row>
      </f7-block>

      <f7-block class="f7-content-btn">
        <f7-row class="justify-content-space-between">
          <f7-button class="f7-btn">TikTok</f7-button>
          <f7-button class="f7-btn">Apple</f7-button>
        </f7-row>
      </f7-block>

      <f7-block class="f7-content-footer">
        <p>
          Already have an account?
          <a href="/login/"> Sign in </a>
        </p>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { f7 } from "framework7-vue";
import {computed, reactive, ref} from "vue";
import { useAuthStore } from "@/js/stores/auth";

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const userData = reactive({
  username: "",
  email: "",
  password: "",
});

const showPassword = ref(false);

const inputStyle = {
  padding: "0px",
  fontFamily: "Rubik",
  fontSize: "16px",
  height: "unset",
  position: "relative",
};

const error = reactive({
  email: "",
  password: "",
});

const remember = ref(false);

const { register, registerByNickname } = useAuthStore();

const registerMode = ref("credentials");
const rememberUser = ref(false);



const btnDisabled = computed(() => registerMode.value === 'credentials' ? !(userData.password && userData.email && userData.username) : !userData.username);

const startRegister = () => {
  if(btnDisabled.value) {
    return;
  }
  if (registerMode.value === "nickname") {
    registerByNickname({
      username: userData.username,
    }).then(resp => {
      if (resp.status === "success") {
        props.f7router.navigate("/activity/");
        return;
      }
      else {
        error.message = "";
        error.email = "";
        error.password = "";
        error.username = "";
        if (resp.error.details.errors) {
          resp.error.details.errors.forEach(err => {
            error[err.path[0]] = err.message;
          });
        } else {
          error.message = resp.error.message;
        }
      }

    });

    return;
  }

  register(
      {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      },
      rememberUser.value,
  ).then(resp => {
    if (resp.status === "success") {
      props.f7router.navigate("/activity/");
      return;
    }
    else {
      error.message = "";
      error.email = "";
      error.password = "";
      error.username = "";
      if (resp.error.details.errors) {
        resp.error.details.errors.forEach(err => {
          error[err.path[0]] = err.message;
        });
      } else {
        error.message = resp.error.message;
      }
    }

  });
};
</script>

<style lang="scss">
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/mixins/form-title.scss";

.custom-list-input {
  height: 68px;
  .item-content {
    padding: 0 !important;
  }

  .item-inner {
    padding: 0 !important;

    &:after {
      display: none;
      background: #212121 !important;
    }
  }

  .item-input-wrap {
    height: 68px;

    &.item-input-focused {
    }

    &:after {
      content: "";
      display: block;
      position: absolute;
      transform: unset !important;
      bottom: 38px !important;
      width: 100% !important;
      height: 1px !important;
      background: #212121 !important;
    }

    .item-input-error-message {
      position: relative !important;
      top: 0;
      margin-top: 20px !important;
      margin-bottom: 0 !important;
    }
  }
}

.hg-register-page {
  .page-content {
    &.login-screen-content {
      @include form-content;

      .login-screen-title {
        @include form-title;
        background-image: url("../assets/images/points.png");
      }
      .block {
        &.inset {
          margin-top: 0 !important;
          margin-bottom: 40px !important;
        }
      }
      .segmented-raised {
        box-shadow: unset;
        .button {
          all: unset;
          font-family: 'Open Sans';
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          color: #212121;
          opacity: 0.5;
          margin: 10px;
          &.active-segment {
            &:after {
              margin-top: 3px;
              content: "";
              display: block;
              background: #8419FF;
              height: 4px;
              width: 100%;
              border-radius: 4px;
            }
            font-weight: 600;
            opacity: 1;
          }
        }
      }
      .list {
        max-width: unset;
        margin: 0;
        .button-large {
          &.button-margin {
            margin-top: 44px;
          }
          &.button-minimal-margin {
            margin-top: 15px;
          }
          margin-top: 15px;
        }
        .error-message {
          color: red;
          font-family: "Rubik";
          font-size: 12px;
          margin-top: 20px;
          min-height: 14px;
          text-align: center;
        }
        .radio-block {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          .radio-round {
            width: 8px;
            height: 8px;
            border: 1px solid #212121;
            border-radius: 100%;
            padding: 4px;

            .radio-circle {
              width: 8px;
              height: 8px;
              border-radius: 100%;
              background: #212121;
            }
          }

          .radio-text {
            font-size: 14px;
            margin-left: 8px;
          }
        }
        .item-input-with-error-message {
          padding-bottom: 0;

          .item-input-error-message {
            margin-top: 10px;
          }
        }

        .item-media {
          min-width: 0;

          + .item-inner {
            margin-left: 0;
          }
        }
      }

      .block {
        padding: 0 !important;
      }

      input {
        &::placeholder {
          color: #212121;
          opacity: 0.5;
        }
      }

      .item-input {
        &.item-input-focused {
          &:not(.item-input-outline) {
            .item-input-wrap {
              &:after {
                transform: unset !important;
                height: 1px !important;
                background: #212121 !important;
              }
            }
          }
        }

        &:not(.item-input-outline) {
          .item-input-wrap {
            &:after {
              transform: unset !important;
              height: 1px !important;
              background: #212121 !important;
            }
          }
        }
      }

      .eye-icons {
        position: absolute;
        top: -1px;
        z-index: 999;
        right: 0;
      }

      .link {
        color: #212121;
      }

      .button {
        @include form-button;
      }

      .f7-btn {
        border: 1px solid #212121;
        width: 100%;
        font-size: 16px;
        font-weight: normal;
        color: #212121;

        &.btn-tiktok {
          margin-left: 10px;
        }
      }

      .f7-content-title {
        margin: 20px;
        display: flex;
        align-items: center;
        justify-content: center;

        .f7-content-title-text {
          font-size: 14px;
          margin: 0 10px;
        }

        .f7-line {
          background: #212121;
          width: 40px;
          height: 1px;
        }
      }

      .f7-content-footer {
        margin: 20px;

        p {
          text-align: center;

          a {
            color: #212121;
            font-weight: 700;
          }
        }
      }

      .f7-footer {
        margin-top: auto !important;

        .block {
          max-width: unset;

          &.f7-content-btn {
            margin: 10px 0;

            & > .justify-content-space-between {
              flex-wrap: nowrap;
              gap: 10px;
            }
          }
        }
      }
    }

  }
}
</style>
