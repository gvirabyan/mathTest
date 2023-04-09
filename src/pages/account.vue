<template>
  <f7-page class="hg-dashboard-content" name="dashboard" @page:beforein="getAllData">
    <top-bar :tabs="profileTabs" :search="false" @tab-selected="setProfileComponent">
      <template #title>Profile</template>
      <template #subtitle>Username</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <div class="profile-account">
          <f7-list form>
            <f7-list-input
              v-model:value="newPassword"
              type="text"
              name="email"
              class="custom-list-input"
              label="E-mail address"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="name"
              class="custom-list-input"
              label="Name"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="surname"
              class="custom-list-input"
              label="Surname"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="Nickname"
              class="custom-list-input"
              label="Nickname"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="date"
              class="custom-list-input"
              label="Date of birth"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="country"
              class="custom-list-input"
              label="Country"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="city"
              class="custom-list-input"
              label="City"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="education"
              class="custom-list-input"
              label="Educational institution"
            />

            <f7-list-input
              v-model:value="confirmNewPassword"
              type="text"
              name="class"
              class="custom-list-input"
              label="Class/course"
            />

            <f7-button @click="logoutHandler" class="log-out-btn">
              <p>
                Log Out
              </p>
            </f7-button>

            <f7-block class="save-btn-block">
              <f7-button
                :class="{
                  'button-save button-large': true,
                  'button-fill': !disableSaveBtn,
                  'button-disabled-fill': disableSaveBtn,
                }"
                @click="updatePasswordHandler"
              >
                Save
              </f7-button>
              <p class="error-message">{{errorMessage}}</p>
            </f7-block>
          </f7-list>
        </div>
      </Transition>
    </main>

    <success-message-popup
        v-if="successPopup"
        @close="successPopup = false"
        :title="successPopup"
    />

    <bottom-menu :current-path="f7route.path" />
    <f7-popup class="logout-popup" swipe-to-close :opened="isPopupOpened" @popup:closed="isPopupOpened = false">
      <f7-page>
        <f7-navbar title="Logout Warning">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>

        <f7-block>
          <p>
            Please provide your email and password to be able to login back later. Otherwise, your account and all
            related data will be deleted immediately after logout. This action can't be reverted
          </p>
        </f7-block>

        <f7-list no-hairlines form>
          <f7-list-input
            v-model:value="nicknamedUserData.email"
            type="text"
            name="email"
            placeholder="E-mail"
          ></f7-list-input>

          <f7-list-input
            v-model:value="nicknamedUserData.password"
            type="password"
            name="password"
            placeholder="Password"
          ></f7-list-input>

          <f7-list-input
            v-model:value="nicknamedUserData.confirmPassword"
            type="password"
            name="password"
            placeholder="Confirm password"
          ></f7-list-input>
        </f7-list>

        <f7-block>
          <f7-button class="mb-8" fill color="blue" @click="nicknamedUserUpdate">Save and logout</f7-button>
          <f7-button fill color="red" @click="nicknamedUserLogout">Delete account</f7-button>
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import {ref, markRaw, reactive} from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
// import { useCategoryStore } from "@/js/stores/categories";
// import { useQuestionsStore } from "@/js/stores/questions";
import delay from "@/js/helpers/delay";
// import ActiveCategoriesPopup from "../components/active-categories-popup.vue";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue"

// const TopList = defineAsyncComponent(() => import("@/components/activity-my-toplist.vue"));
// const MyAnswers = defineAsyncComponent(() => import("@/components/activity-my-answers.vue"));

const props = defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
  f7router: Object
});

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);
const { isNicknamedOnlyUser } = storeToRefs(authStore);

const profileTabs = ref([
  {
    id: 1,
    name: "Account",
    path: '/profile/account/'
    // component: markRaw(Account),
  },
  {
    id: 2,
    name: "Security",
    path: '/profile/security/'
    // component: markRaw(Security),
  },
  {
    id: 3,
    name: "About Us",
    path: '/profile/about-us/'
    // component: markRaw(AboutUs),
  },
]);

const isLoading = ref(false);

const { logout, updateNicknamedUser, deleteNicknamedUser, getUser } = authStore;

const successPopup = ref(false)

const isPopupOpened = ref(false);

const logoutHandler = () => {
  if (isNicknamedOnlyUser.value) {
    isPopupOpened.value = true;
    return;
  }
  logoutUser();
};

const logoutUser = () => {
  logout().then(() => {
    props.f7router.navigate("/login/");
  });
};

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

const getAllData = async () => {
  isLoading.value = true;

  await delay();
  await Promise.all([
    getUser(),
    // getLastCategory(),
    // getPastCategories(),
    // getAnsweredQuestionsCount(),
    // getCategories()
  ]);

  isLoading.value = false;
};

const nicknamedUserData = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const nicknamedUserUpdate = () => {
  if (nicknamedUserData.password === nicknamedUserData.confirmPassword) {
    updateNicknamedUser(nicknamedUserData).then(resp => {
      if (resp.status === "success") {
        isPopupOpened.value = false;
        logoutUser();
        return;
      }

      // f7.toast.show({
      //   text: resp.message,
      //   closeButton: true,
      // });
    });

    return;
  }

  // f7.toast.show({
  //   text: "Password and password confirmation should match",
  //   closeButton: true,
  // });
};

const nicknamedUserLogout = () => {
  deleteNicknamedUser().then(resp => {
    if (resp.status === "success") {
      isPopupOpened.value = false;
      logoutUser();
      return;
    }

    // f7.toast.show({
    //   text: resp.message,
    //   closeButton: true,
    // });
  });
};

</script>

<style lang="scss">
@import "../assets/scss/pages/profile";
@import "@/assets/scss/pages/account.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
