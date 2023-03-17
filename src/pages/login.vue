<template>
  <f7-page class="hg-login-page" login-screen>
    <!--    <img class="hg-login-points" src="@/assets/images/points.png" >-->
    <f7-list form>
      <f7-login-screen-title>Sign In</f7-login-screen-title>
      <f7-list-input
        v-model:value="userData.identifier"
        type="text"
        name="email"
        :input-style="inputStyle"
        class="custom-list-input"
        :error-message-force="!!error.identifier"
        :error-message="error.identifier"
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

      <!--      <f7-list-item radio name="myRadioGroup" value="option1" title="Option 1"></f7-list-item>-->
      <!--      <f7-list-item v-model:checked="rememberUser" radio checkbox title="Remember me" name="remember"></f7-list-item>-->

      <f7-block class="f7-forgot-password">
        <f7-row class="justify-content-between">
          <div class="radio-block" @click="remember = !remember">
            <div class="radio-round">
              <div v-if="remember" class="radio-circle" />
            </div>
            <span class="radio-text">Remember me</span>
          </div>
          <f7-link href="/forgot-password/">Forgot password?</f7-link>
        </f7-row>
      </f7-block>
      <f7-block>
        <f7-button
          :class="{
            'button button-raised button-large': true,
            'button-fill': !btnDisabled,
            'button-disabled-fill': btnDisabled,
          }"
          @click="startLogin"
        >
          Sign In
        </f7-button>
      </f7-block>
    </f7-list>

    <f7-list class="f7-footer">
      <f7-block class="f7-content-title">
        <div class="f7-line" />
        <p class="f7-content-title-text">Sign In using</p>
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
          Don’t have an account?
          <a href="/register/"> Sign Up </a>
        </p>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import { ref, reactive, computed } from "vue";
import { f7 } from "framework7-vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import fbHandler from "@/js/handlers/fb-handler";

const showPassword = ref(false);

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const backendUrl = import.meta.env.VITE_API_URL;

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

const { suggestedCredentials } = storeToRefs(useAuthStore());
const rememberUser = ref(false);

const { login } = useAuthStore();

const btnDisabled = computed(() => !(userData.password && userData.identifier));

const remember = ref(false);

const startLogin = () => {
  login(userData, rememberUser.value).then(resp => {
    if (resp.status === "success") {
      props.f7router.navigate("/dashboard/");
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
  let login_response = await fbHandler.login();
  console.log(login_response);
};

userData.identifier = suggestedCredentials.value.suggestedLogin;
userData.password = suggestedCredentials.value.suggestedPassword;
</script>

<style lang="scss">
.custom-list-input {
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

.hg-login-page {
  .page-content {
    &.login-screen-content {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      display: flex;
      flex-direction: column;
      height: 100vh !important;
      padding: 0 30px;
      position: relative;
      color: #212121;
      font-family: "Rubik", sans-serif;

      .login-screen-title {
        max-width: unset;
        font-weight: 400;
        font-size: 32px;
        margin: 0;
        padding: 62px 0 32px 0;
        background-position: right;
        background-repeat: no-repeat;
        margin: 0 -14px;
        background-image: url("../assets/images/points.png");
      }

      .list {
        max-width: unset;
        margin: 0;

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

        &.f7-forgot-password {
          max-width: unset;
          margin: -6px 0 54px 0 !important;

          .link {
            font-size: 14px;
          }

          .radio-block {
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
        }
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
        padding: 12px;
        border-radius: 6px;
        height: unset !important;
        line-height: unset;
        text-transform: unset;
        font-size: 20px;
        color: white;

        &.button-fill {
          background-color: #8419ff;
        }

        &.button-disabled-fill {
          background-color: #e6d1ff;
        }
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
