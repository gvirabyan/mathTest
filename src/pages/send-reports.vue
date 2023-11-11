<template>
  <f7-page class="hg-dashboard-content send-reports-dash" name="dashboard">
    <top-bar :first-load-index="3" :search="false" :tabs="profileTabs" @tab-selected="setProfileComponent">
      <template #title>{{ $t("profile.profile") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal}  ${$t("top-bar.questions")}`
      }}</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition v-if="!isLoading" name="fade">
        <div class="send-reports-page">
          <div class="content">
            <f7-block v-if="!isLoading" class="emails-block">
              <div v-if="parentsEmails.length">
                <p class="m-0 mb-8">{{ $t("profile.send-reports.saved-email") }}</p>
                <f7-list class="emails-list">
                  <f7-list-item v-for="{ id, email } in parentsEmails" :key="`parent-email_${id}`" :title="email">
                    <template #content>
                      <f7-button class="action-btn delete-action" fill @click="openRemoveParentEmail(id)">
                        <img alt="" src="@/assets/icons/trash.svg" />
                      </f7-button>
                    </template>
                  </f7-list-item>
                </f7-list>
              </div>

              <p v-else-if="!parentsEmails.length">{{ $t("profile.send-reports.not-saved-email") }}</p>
            </f7-block>

            <template v-if="parentsEmails.length < 4">
              <f7-list form>
                <f7-list-input
                  v-model:value="parentsEmailsInputs.email1"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  name="email"
                  :placeholder="$t('profile.send-reports.parent-email')"
                  type="text"
                />
                <f7-list-input
                  v-if="parentsEmailsInputs.email1 && parentsEmails.length < 3"
                  v-model:value="parentsEmailsInputs.email2"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  name="email"
                  :placeholder="$t('profile.send-reports.parent-email')"
                  type="text"
                />
                <f7-list-input
                  v-if="parentsEmailsInputs.email2 && parentsEmails.length < 2"
                  v-model:value="parentsEmailsInputs.email3"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  name="email"
                  :placeholder="$t('profile.send-reports.parent-email')"
                  type="text"
                />
                <f7-list-input
                  v-if="parentsEmailsInputs.email3 && parentsEmails.length < 1"
                  v-model:value="parentsEmailsInputs.email4"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  name="email"
                  :placeholder="$t('profile.send-reports.parent-email')"
                  type="text"
                />
              </f7-list>
            </template>
          </div>
          <f7-block class="reports-footer">
            <f7-button
              v-if="parentsEmails.length < 4"
              :class="btnDisabled ? 'button-disabled-fill' : 'button-fill'"
              class="button button-raised button-large"
              @click="saveParentsEmailsHandler"
              >{{ $t("buttons.save") }}
            </f7-button>
            <p v-else>{{ $t("profile.send-reports.add-four-email-text") }}</p>
            <p class="reports-footer-error">{{ errorMsg }}</p>
          </f7-block>
        </div>
      </Transition>

      <Transition v-else class="loading-reports" mode="in-out" name="loader-fadeout">
        <loading-small />
      </Transition>
    </main>

    <success-message-popup v-if="successPopup" :title="successPopupText" @close="successPopup = false" />

    <leave-page-popup
      v-if="deletePopup"
      :leave-btn="$t('profile.send-reports.no')"
      :save-btn="$t('profile.send-reports.yes')"
      :text="$t('profile.send-reports.leave-popup-text')"
      :title="$t('profile.send-reports.leave-popup-title')"
      @close="deletePopup = false"
      @leave-changes="deletePopup = false"
      @save-changes="removeParentEmailHandler"
    />
    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { computed, defineAsyncComponent, onMounted, reactive, ref } from "vue";
import { f7 } from "framework7-vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import { useParentsEmailsStore } from "@/js/stores/parents-emails";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import LoadingSmall from "@/components/loading-small.vue";
import playAudioMixin from "@/js/mixins/play_audio";
import { useI18n } from "vue-i18n";

const LeavePagePopup = defineAsyncComponent(() => import("@/components/leave-page-popup.vue"));
const SuccessMessagePopup = defineAsyncComponent(() => import("@/components/success-message-popup.vue"));

const { playAudio } = playAudioMixin.setup();

const props = defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
  f7router: {
    type: Object,
    default: () => {},
  },
});

const { user } = storeToRefs(useAuthStore());
const { parentsEmails } = storeToRefs(useParentsEmailsStore());
const { getParentsEmails, saveParentsEmails, removeParentEmail } = useParentsEmailsStore();

const inputStyle = {
  padding: "0px",
  fontFamily: "Rubik",
  fontSize: "16px",
  height: "unset",
  position: "relative",
};

const isLoading = ref(false);
const isSending = ref(false);

const i18n = useI18n();
const profileTabs = ref([
  {
    id: 1,
    name: i18n.t("profile.tabs.0"),
    path: "/profile/account/",
  },
  {
    id: 2,
    name: i18n.t("profile.tabs.1"),
    path: "/profile/security/",
  },
  {
    id: 3,
    name: i18n.t("profile.tabs.2"),
    path: "/profile/about-us/",
  },
  {
    id: 4,
    name: i18n.t("profile.tabs.3"),
    path: "/profile/send-reports/",
  },
  {
    id: 5,
    name: i18n.t("profile.tabs.4"),
    path: "/profile/profile-sound/",
  },
]);
const deletePopup = ref(false);
const errorMsg = ref("");
const successPopup = ref(false);
const successPopupText = ref("");

const parentsEmailsInputs = reactive({
  email1: "",
  email2: "",
  email3: "",
  email4: "",
});

const areAllInputsEmpty = computed(() => Object.values(parentsEmailsInputs).every(el => !el));
const btnDisabled = computed(() => areAllInputsEmpty.value || isSending.value);

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

const getParentsEmailsHandler = async () => {
  isLoading.value = true;

  await delay();
  await getParentsEmails();

  isLoading.value = false;
};

const saveParentsEmailsHandler = async () => {
  if (!btnDisabled.value) {
    isSending.value = true;
    errorMsg.value = "";
    playAudio("formSubmit");
    await saveParentsEmails(parentsEmailsInputs).then(res => {
      if (res.status === "success") {
        successPopup.value = true;
        successPopupText.value = i18n.t("profile.send-reports.saved-successfully");
        Object.keys(parentsEmailsInputs).forEach(key => (parentsEmailsInputs[key] = "")); // clear all inputs
        return;
      }

      errorMsg.value = res.message;
    });

    isSending.value = false;
  }
};

const openRemoveParentEmail = id => {
  deletePopup.value = id;
};

const removeParentEmailHandler = async () => {
  await removeParentEmail(deletePopup.value).then(res => {
    if (res.status === "success") {
      deletePopup.value = false;
      successPopup.value = true;
      successPopupText.value = i18n.t("profile.send-reports.remove-success-text");
      return;
    }

    f7.toast.show({
      text: res.message,
      closeButton: true,
    });
  });
};

onMounted(() => {
  getParentsEmailsHandler();
});
</script>

<style lang="scss">
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/mixins/form-title.scss";
@import "../assets/scss/pages/send-reports";

.send-reports-dash {
  .loading-container {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.hg-reports-page {
  background: var(--f7-login-screen-content-bg-color);

  .page-content {
    @include form-content;
    justify-content: center;

    .block-title {
      @include form-title;
      margin: 0;
      color: #212121;
    }

    .emails-block {
      padding-right: 0;
      padding-left: 0;
    }

    .list {
      max-width: unset;
      margin: 0;

      ul::before,
      ul::after {
        display: none;
      }
    }

    .emails-list {
      margin-bottom: 24px;

      .item-content {
        padding-left: 0;
      }
    }

    input {
      &::placeholder {
        color: #212121;
        opacity: 0.5;
      }
    }

    .custom-list-input {
      .item-input-wrap {
        height: 68px;
      }
    }

    .item-input {
      padding: 0;

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

      .item-inner {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding-right: 0;
      }
    }

    .block {
      max-width: var(--f7-login-screen-blocks-max-width);
    }

    .button {
      @include form-button;

      &.action-btn {
        padding: 8px;
        color: #212121;
        font-size: 16px;
        background: none;

        .icon {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
