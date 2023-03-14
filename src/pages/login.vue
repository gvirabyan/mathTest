<template>
  <f7-page class="hg-login-page" login-screen>
<!--    <img class="hg-login-points" src="@/assets/images/points.png" >-->
    <f7-list form>
      <f7-login-screen-title>Sign In</f7-login-screen-title>
      <f7-list-input
        v-model:value="userData.identifier"
        type="text"
        name="email"
        :error-message-force="!!error.identifier"
        :error-message="error.identifier"
        placeholder="Your email"
      ></f7-list-input>

      <f7-list-input
        v-model:value="userData.password"
        :type="showPassword ? 'text' : 'password'"
        name="password"
        :error-message-force="!!error.password"
        :error-message="error.password"
        placeholder="Your password"
      >
        <template v-slot:media>
          <div @click="showPassword = !showPassword" class="eye-icons">
            <svg v-if="showPassword" class="icon-show" width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.0749 0.63623C5.9082 0.63623 2.34987 3.2279 0.908203 6.88623C2.34987 10.5446 5.9082 13.1362 10.0749 13.1362C14.2415
                13.1362 17.7999 10.5446 19.2415 6.88623C17.7999 3.2279 14.2415 0.63623 10.0749 0.63623ZM10.0749 11.0529C7.77487 11.0529 5.9082
                9.18623 5.9082 6.88623C5.9082 4.58623 7.77487 2.71956 10.0749 2.71956C12.3749 2.71956 14.2415 4.58623 14.2415 6.88623C14.2415
                9.18623 12.3749 11.0529 10.0749 11.0529ZM10.0749 4.38623C8.69154 4.38623 7.57487 5.5029 7.57487 6.88623C7.57487 8.26956 8.69154
                9.38623 10.0749 9.38623C11.4582 9.38623 12.5749 8.26956 12.5749 6.88623C12.5749 5.5029 11.4582 4.38623 10.0749 4.38623Z" fill="#212121"
              />
            </svg>
            <svg v-else width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.2">
                <path d="M9.84546 7.2729L12.7273 10.1456V10.0002C12.7273 9.27686 12.4399 8.58317 11.9285 8.0717C11.417 7.56024 10.7233 7.2729
                  10 7.2729H9.84546ZM5.93636 8.00018L7.34545 9.40927C7.3 9.60018 7.27273 9.79109 7.27273 10.0002C7.27273 10.7235 7.56006 11.4172
                  8.07153 11.9287C8.58299 12.4401 9.27668 12.7275 10 12.7275C10.2 12.7275 10.4 12.7002 10.5909 12.6547L12 14.0638C11.3909 14.3638
                  10.7182 14.5456 10 14.5456C8.79447 14.5456 7.63832 14.0667 6.78588 13.2143C5.93344 12.3619 5.45455 11.2057 5.45455 10.0002C5.45455
                  9.282 5.63636 8.60927 5.93636 8.00018ZM0.909091 2.9729L2.98182 5.04563L3.39091 5.45472C1.89091 6.63654 0.709091 8.182 0 10.0002C1.57273
                  13.9911 5.45455 16.8184 10 16.8184C11.4091 16.8184 12.7545 16.5456 13.9818 16.0547L14.3727 16.4365L17.0273 19.0911L18.1818
                  17.9365L2.06364 1.81836M10 5.45472C11.2055 5.45472 12.3617 5.93362 13.2141 6.78606C14.0666 7.63849 14.5455 8.79465 14.5455
                  10.0002C14.5455 10.582 14.4273 11.1456 14.2182 11.6547L16.8818 14.3184C18.2455 13.182 19.3364 11.6911 20 10.0002C18.4273
                  6.00927 14.5455 3.182 10 3.182C8.72727 3.182 7.50909 3.40927 6.36364 3.81836L8.33636 5.7729C8.85455 5.5729 9.40909
                  5.45472 10 5.45472Z" fill="#212121"
                />
              </g>
            </svg>
          </div>
        </template>

      </f7-list-input>

      <f7-list-item-radio name="myRadioGroup" value="option1" title="Option 1"></f7-list-item-radio>
      <f7-list-item-radio v-model:checked="rememberUser" checkbox title="Remember me" name="remember"></f7-list-item-radio>

      <f7-block class="f7-forgot-password">
        <f7-row class="justify-content-between">
          <div @click="remember = !remember" class="radio-block">
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
          <f7-button class="f7-btn btn-tiktok">TikTok</f7-button>
        </f7-row>
      </f7-block>

      <f7-block class="f7-content-btn">
        <f7-button class="f7-btn">Apple</f7-button>
      </f7-block>
      <f7-block class="f7-content-footer">
        <p>Don’t have an account?
          <a href="/register/">
            Sign Up
          </a>
        </p>
      </f7-block>
    </f7-list>
  </f7-page>
</template>

<script setup>
import {ref, reactive, computed} from "vue";
import { useAuthStore } from "@/js/stores/auth";
import { f7 } from "framework7-vue";
import { storeToRefs } from "pinia";

const showPassword = ref(false)

const props = defineProps({
  f7route: Object,
  f7router: Object,
});

const userData = reactive({
  identifier: "",
  password: "",
});

const error = reactive({
  identifier: "",
  password: "",
});

const { suggestedCredentials } = storeToRefs(useAuthStore());
const rememberUser = ref(false);

const { login } = useAuthStore();

const btnDisabled = computed(() => userData.password && userData.identifier ? false : true)

const remember = ref(false)

const startLogin = () => {
  login(userData, rememberUser.value).then(resp => {
    if (resp.status === "success") {
      props.f7router.navigate("/dashboard/");
    } else {
      error.identifier = ''
      error.password = ''
      if(resp.error.details.errors) {
        resp.error.details.errors.forEach(err => {
          error[err.path[0]] = err.message
        })
      } else {
        f7.toast.show({
          text: resp.error.message,
          closeButton: true,
        });
      }

    }
  });
};

userData.identifier = suggestedCredentials.value.suggestedLogin;
userData.password = suggestedCredentials.value.suggestedPassword;
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700;800;900&display=swap');
.hg-login-page {
  .page-content {
    &.login-screen-content {
      margin-top: 0 !important;
      margin-bottom: 0 !important;
      display: flex;
      flex-direction: column;
      height: 100vh !important;
      padding: 0 14px;
      position: relative;
      color: #212121;
      font-family: 'Rubik';
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
          padding-bottom: 0px;
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
        ul {
          li {
            min-height: 70px;
          }
        }

        .f7-forgot-password {
          max-width: unset;
          margin: 24px 0 54px 0;
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
        input {
          padding-bottom: 10px;
          &::placeholder {
            color: #212121;
            opacity: 0.5;
          }
        }
      }
      .item-input {
        &.item-input-focused {
          &:not(.item-input-outline){
            .item-input-wrap{
              &:after {
                transform: unset !important;
                height: 1px !important;
                background: #212121 !important;
              }
            }
          }
        }

        &:not(.item-input-outline){
          .item-input-wrap{
            &:after {
              transform: unset;
              height: 1px !important;
              background: #212121 !important;
            }
          }
        }
      }

      .eye-icons {
        position: absolute;
        top: 7px;
        z-index: 999;
        padding-right: 14px;
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
          background-color: #8419FF;
        }
        &.button-disabled-fill {
          background-color: #E6D1FF;
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
        margin-top: auto;
        .block {
          max-width: unset;
          &.f7-content-btn {
            margin: 10px 0;
          }
          .row {
            flex-wrap: nowrap;
          }
        }
      }
    }
  }
}

</style>
