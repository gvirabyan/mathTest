<template>
  <f7-page class="hg-login-page" login-screen>
    <f7-list form>
      <f7-login-screen-title>{{ $t("login-register.sign-in") }}</f7-login-screen-title>
      <f7-list-input
        v-model:value="userData.identifier"
        type="text"
        name="email"
        :input-style="inputStyle"
        class="custom-list-input"
        :error-message-force="!!error.identifier"
        :error-message="error.identifier"
        :placeholder="$t('inputs.E-mail')"
      ></f7-list-input>

      <f7-list-input
        v-model:value="userData.password"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        :input-style="inputStyle"
        class="custom-list-input"
        :error-message-force="!!error.password"
        :error-message="error.password"
        :placeholder="$t('inputs.password')"
      >
        <template #media>
          <div class="eye-icons" @click="showPassword = !showPassword">
            <img v-if="showPassword" src="@/assets/icons/eye.svg" alt="eye" />
            <img v-else src="@/assets/icons/eyeline.svg" alt="eyeline" />
          </div>
        </template>
      </f7-list-input>

      <f7-block class="f7-forgot-password">
        <f7-row class="justify-content-between">
          <div class="radio-block" @click="remember = !remember">
            <div class="radio-round">
              <div v-if="remember" class="radio-circle" />
            </div>
            <span class="radio-text">{{ $t("login-register.remember-me") }}</span>
          </div>
          <f7-link href="/forgot-password/">{{ $t("login-register.forgot-password") }}</f7-link>
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
          {{ $t("login-register.sign-in") }}
        </f7-button>
      </f7-block>
    </f7-list>

    <f7-list class="f7-footer">
      <f7-block class="f7-content-title">
        <div class="f7-line" />
        <p class="f7-content-title-text">{{ $t("login-register.sign-in-using") }}</p>
        <div class="f7-line" />
      </f7-block>

      <f7-block class="f7-content-btn">
        <f7-row class="justify-content-space-between">
          <f7-button class="f7-btn">{{ $t("login-register.google") }}</f7-button>
          <f7-button class="f7-btn" @click="fbLoginHandler">{{ $t("login-register.facebook") }}</f7-button>
        </f7-row>
      </f7-block>

      <f7-block class="f7-content-btn">
        <f7-row class="justify-content-space-between">
          <f7-button class="f7-btn">{{ $t("login-register.tiktok") }}</f7-button>
          <f7-button class="f7-btn">{{ $t("login-register.apple") }}</f7-button>
        </f7-row>
      </f7-block>

      <f7-block class="f7-content-footer">
        <p>
          {{ $t("login-register.dont-have-account") }}
          <a href="/register/">{{ $t("login-register.sign-up") }}</a>
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
import { useI18n } from "vue-i18n";

const showPassword = ref(false);

const props = defineProps({
  f7route: { type: Object, default: () => {} },
  f7router: { type: Object, default: () => {} },
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
      props.f7router.navigate("/");
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

const i18n = useI18n();

const fbLoginHandler = async function () {
  await fbHandler.login().then(response => {
    if (response.authResponse) {
      loginViaProvider("facebook", `?access_token=${response.authResponse.accessToken}`).then(resp => {
        if (resp.status === "success") {
          props.f7router.navigate("/");
          return;
        }

        f7.toast.show({
          text: resp.error.message,
          closeButton: true,
        });
      });
    } else {
      alert(i18n.t("login-register.user-cancelled-login"));
    }
  });
};

userData.identifier = suggestedCredentials.value.suggestedLogin;
userData.password = suggestedCredentials.value.suggestedPassword;
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

.hg-login-page {
  .page-content {
    &.login-screen-content {
      @include form-content;

      .login-screen-title {
        @include form-title;
        background-image: url("../assets/images/points.svg");
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
