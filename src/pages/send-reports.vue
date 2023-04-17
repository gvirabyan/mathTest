<template>
  <f7-page class="hg-dashboard-content" name="dashboard">
    <top-bar :tabs="profileTabs" :search="false" @tab-selected="setProfileComponent" :first-load-index="3">
      <template #title>Profile</template>
      <template #subtitle>Username</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition v-if="!isLoading" name="fade">
        <div class="send-reports-page">
          <div class="content">
            <f7-block v-if="!isLoading" class="emails-block"
            >
              <div v-if="parentsEmails.length">
                <p class="m-0 mb-8">Saved emails:</p>
                <f7-list class="emails-list">
                  <f7-list-item v-for="{ id, email } in parentsEmails" :key="`parent-email_${id}`" :title="email">
                    <template #content>
                      <f7-button fill class="action-btn edit-action" @click="openEditParentEmail(id, email)"
                      >
                        <img src="@/assets/icons/pencil.svg" >
                      </f7-button>
                      <f7-button fill class="action-btn delete-action" @click="openRemoveParentEmail(id)"
                      >
                        <img src="@/assets/icons/trash.svg" >
                      </f7-button>
                    </template>
                  </f7-list-item>
                </f7-list>
              </div>

              <p v-else>You did not saved any parents' emails yet</p>
            </f7-block>
            <template v-if="parentsEmails.length < 4">
              <f7-list form>
                <f7-list-input
                  v-model:value="parentsEmailsInputs.email1"
                  type="text"
                  name="email"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  placeholder="Enter parent's email"
                />
                <f7-list-input
                  v-if="parentsEmailsInputs.email1 && parentsEmails.length < 3"
                  v-model:value="parentsEmailsInputs.email2"
                  type="text"
                  name="email"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  placeholder="Enter parent's email"
                />
                <f7-list-input
                  v-if="parentsEmailsInputs.email2 && parentsEmails.length < 2"
                  v-model:value="parentsEmailsInputs.email3"
                  type="text"
                  name="email"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  placeholder="Enter parent's email"
                />
                <f7-list-input
                  v-if="parentsEmailsInputs.email3 && parentsEmails.length < 1"
                  v-model:value="parentsEmailsInputs.email4"
                  type="text"
                  name="email"
                  :input-style="inputStyle"
                  class="custom-list-input"
                  placeholder="Enter parent's email"
                />
              </f7-list>
            </template>
          </div>
          <f7-block  class="reports-footer">
            <f7-button
              v-if="parentsEmails.length < 4"
              class="button button-raised button-large"
              :class="btnDisabled ? 'button-disabled-fill' : 'button-fill'"
              @click="saveParentsEmailsHandler"
            >
              Save
            </f7-button>
            <p v-else>You can add no more than 4 emails, but you can edit one of the existing emails or remove it.</p>
            <p class="reports-footer-error">{{errorMsg}}</p>
          </f7-block>
        </div>
      </Transition>

      <Transition v-else class="loading-reports" name="loader-fadeout" mode="in-out">
        <loading-small />
      </Transition>
    </main>
    <success-message-popup
      v-if="successPopup"
      :title="successPopup"
      @close="successPopup = false"
    />
    <update-popup
      v-if="updatePopup"
      title="Please enter new E-mail"
      :input-value="updateEmail"
      @save="editParentEmailHandler"
      :error="errUpdateMsg"
      @close="updatePopup = false"
    />
    <leave-page-popup
      v-if="deletePopup"
      title="Are you sure you want to <br> delete this E-mail ?"
      text="If you close this popup E-mail will be not removed"
      leave-btn="No" save-btn="Yes"
      @leave-changes="deletePopup = false"
      @save-changes="removeParentEmailHandler"
      @close="deletePopup = false"
    />
    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import { f7 } from "framework7-vue";
import { storeToRefs } from "pinia";
import { useParentsEmailsStore } from "@/js/stores/parents-emails";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue";
import LeavePagePopup from "@/components/leave-page-popup.vue";
import UpdatePopup from "@/components/update-popup.vue";
import LoadingSmall from "@/components/loading-small.vue";

const props = defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
  f7router: Object
});

onMounted( () => {
  getParentsEmailsHandler()
})

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

const deletePopup = ref(false)

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

const errorMsg = ref('');
const successPopup = ref(false);
const saveParentsEmailsHandler = async () => {
  if(!btnDisabled.value) {
    isSending.value = true;
    errorMsg.value = '';
    await saveParentsEmails(parentsEmailsInputs).then(res => {
      if (res.status === "success") {
        successPopup.value = 'You have saved successfully';
        Object.keys(parentsEmailsInputs).forEach(key => (parentsEmailsInputs[key] = "")); // clear all inputs
        return;
      }
      errorMsg.value = res.message;
    });

    isSending.value = false;
  }
};

const updatePopup = ref(false);
const updateEmail = ref('');

const openEditParentEmail = (id, email) => {
  updatePopup.value = id;
  updateEmail.value = email;
};

const openRemoveParentEmail = id => {
  deletePopup.value = id;
};
const errUpdateMsg = ref('');

const editParentEmailHandler = async (email) => {
  errUpdateMsg.value = ''
  if (!email) {
    errUpdateMsg.value = 'Email cannot be empty'
    return;
  }

  await editParentEmail(updatePopup.value, email).then(res => {
    if (res.status === "success") {
      updatePopup.value = false;
      successPopup.value = "You have successfully updated parent's email"
      return;
    }
    errUpdateMsg.value = res.message;
  });
};

const removeParentEmailHandler = async () => {
  await removeParentEmail(deletePopup.value).then(res => {
    if (res.status === "success") {
      deletePopup.value = false;
      successPopup.value = "You have successfully removed parent's email"
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
@import "../assets/scss/pages/send-reports";

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
