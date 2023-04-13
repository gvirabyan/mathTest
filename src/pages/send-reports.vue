<template>
  <f7-page class="hg-dashboard-content about-us-page" name="dashboard">
    <top-bar :tabs="profileTabs" :search="false" @tab-selected="setProfileComponent" :first-load-index="3">
      <template #title>Profile</template>
      <template #subtitle>Username</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <div>
          <f7-block v-if="!isLoading" class="emails-block"
          ><div v-if="parentsEmails.length">
            <p class="m-0 mb-8">Saved emails:</p>

            <f7-list class="emails-list">
              <f7-list-item v-for="{ id, email } in parentsEmails" :key="`parent-email_${id}`" :title="email">
                <template #content>
                  <f7-button fill class="ml-8 action-btn" @click="openEditParentEmail(id, email)"
                  ><f7-icon f7="pencil"></f7-icon
                  ></f7-button>
                  <f7-button fill class="ml-8 action-btn" @click="openRemoveParentEmail(id)"
                  ><f7-icon f7="trash"></f7-icon
                  ></f7-button>
                </template>
              </f7-list-item>
            </f7-list>
          </div>

            <p v-else>You did not saved any parents' emails yet</p>
          </f7-block>

          <f7-block v-else class="emails-block">
            <f7-skeleton-block class="mb-4" effect="wave" />
            <f7-skeleton-block class="mb-4" effect="wave" />
            <f7-skeleton-block class="mb-4" effect="wave" />
            <f7-skeleton-block class="mb-4" effect="wave" />
          </f7-block>

          <template v-if="parentsEmails.length < 4"
          ><f7-list form>
            <f7-list-input
                v-model:value="parentsEmailsInputs.email1"
                type="text"
                name="email"
                :input-style="inputStyle"
                class="custom-list-input"
                placeholder="Enter parent's email"
            ></f7-list-input>
            <f7-list-input
                v-if="parentsEmailsInputs.email1 && parentsEmails.length < 3"
                v-model:value="parentsEmailsInputs.email2"
                type="text"
                name="email"
                :input-style="inputStyle"
                class="custom-list-input"
                placeholder="Enter parent's email"
            ></f7-list-input>
            <f7-list-input
                v-if="parentsEmailsInputs.email2 && parentsEmails.length < 2"
                v-model:value="parentsEmailsInputs.email3"
                type="text"
                name="email"
                :input-style="inputStyle"
                class="custom-list-input"
                placeholder="Enter parent's email"
            ></f7-list-input>
            <f7-list-input
                v-if="parentsEmailsInputs.email3 && parentsEmails.length < 1"
                v-model:value="parentsEmailsInputs.email4"
                type="text"
                name="email"
                :input-style="inputStyle"
                class="custom-list-input"
                placeholder="Enter parent's email"
            ></f7-list-input>
          </f7-list>

            <f7-block>
              <f7-button
                  class="button button-raised button-large"
                  :class="btnDisabled ? 'button-disabled-fill' : 'button-fill'"
                  @click="saveParentsEmailsHandler"
              >
                Update
              </f7-button>
            </f7-block>
          </template>
          <p v-else>You can add no more than 4 emails, but you can edit one of the existing emails or remove it.</p>
        </div>
      </Transition>
    </main>

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { f7 } from "framework7-vue";
import { storeToRefs } from "pinia";
import { useParentsEmailsStore } from "@/js/stores/parents-emails";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";

const props = defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
  f7router: Object
});

const { parentsEmails } = storeToRefs(useParentsEmailsStore());
const { getParentsEmails, saveParentsEmails, editParentEmail, removeParentEmail } = useParentsEmailsStore();

const inputStyle = {
  padding: "0px",
  fontFamily: "Rubik",
  fontSize: "16px",
  height: "unset",
  position: "relative",
};

const isLoading = ref(false);
const isSending = ref(false);

const parentsEmailsInputs = reactive({
  email1: "",
  email2: "",
  email3: "",
  email4: "",
});

const btnDisabled = computed(() => !Object.values(parentsEmailsInputs).some(el => el) || isSending.value);
const multipleEmails = computed(() => Object.values(parentsEmailsInputs).length > 1);


const profileTabs = ref([
  {
    id: 1,
    name: "Account",
    path: '/profile/account/'
  },
  {
    id: 2,
    name: "Security",
    path: '/profile/security/'
  },
  {
    id: 3,
    name: "About Us",
    path: '/profile/about-us/'
  },
  {
    id: 4,
    name: "Send Reports",
    path: '/profile/send-reports/'
  },
]);

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
  isSending.value = true;

  await saveParentsEmails(parentsEmailsInputs).then(res => {
    if (res.status === "success") {
      f7.toast.show({
        text: multipleEmails.value
          ? "You have saved parents' emails successfully"
          : "You have saved parent's email successfully",
        closeButton: true,
      });

      Object.keys(parentsEmailsInputs).forEach(key => (parentsEmailsInputs[key] = "")); // clear all inputs

      return;
    }

    f7.toast.show({
      text: res.message,
      closeButton: true,
    });
  });

  isSending.value = false;
};

const openEditParentEmail = (id, email) => {
  f7.dialog.prompt(
    "Please enter new email",
    "Edit the parent's email",
    function (value) {
      editParentEmailHandler(id, value);
    },
    null,
    email,
  );
};

const openRemoveParentEmail = id => {
  f7.dialog.confirm(
    "Are you sure?",
    "Remove the parent's email",
    function () {
      removeParentEmailHandler(id);
    },
    null,
  );
};

const editParentEmailHandler = async (id, email) => {
  if (!email) {
    f7.toast.show({
      text: "Email cannot be empty",
      closeButton: true,
    });
  }

  await editParentEmail(id, email).then(res => {
    if (res.status === "success") {
      f7.dialog.close();

      f7.toast.show({
        text: "You have successfully updated parent's email",
        closeButton: true,
      });

      return;
    }

    f7.toast.show({
      text: res.message,
      closeButton: true,
    });
  });
};

const removeParentEmailHandler = async id => {
  await removeParentEmail(id).then(res => {
    if (res.status === "success") {
      f7.dialog.close();

      f7.toast.show({
        text: "You have successfully removed parent's email",
        closeButton: true,
      });

      return;
    }

    f7.toast.show({
      text: res.message,
      closeButton: true,
    });
  });
};
</script>

<style lang="scss">
@import "@/assets/scss/mixins/form-button.scss";
@import "@/assets/scss/mixins/form-content.scss";
@import "@/assets/scss/mixins/form-title.scss";
@import "../assets/scss/pages/profile";

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
