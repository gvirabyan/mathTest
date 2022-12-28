<template>
  <f7-page name="settings">
    <f7-navbar title="Settings" back-link="Back" />
    <f7-block-title>Settings</f7-block-title>

    <f7-list class="settings-list">
      <f7-list-item v-for="({ href, title }, index) in settingsItems" :key="`menu-item_${index + 1}`">
        <f7-link panel-close :href="`/settings/${href}/`">{{ title }}</f7-link>
      </f7-list-item>

      <f7-list-item key="logout" class="logout-btn">
        <f7-link
          icon-ios="f7:square_arrow_right"
          icon-aurora="f7:square_arrow_right"
          icon-md="material:logout"
          icon-color="red"
          badge-color="red"
          @click="logoutHandler"
        >&nbsp;&nbsp;&nbsp;Logout</f7-link>
      </f7-list-item>
    </f7-list>

    <f7-popup
      class="logout-popup"
      swipe-to-close
      :opened="isPopupOpened"
      @popup:closed="isPopupOpened = false"
    >
      <f7-page>
        <f7-navbar title="Logout Warning">
          <f7-nav-right>
            <f7-link popup-close>Close</f7-link>
          </f7-nav-right>
        </f7-navbar>
        <f7-block>
          <p>Please provide your email and password to be able to login back later. Otherwise, your account and all
            related data will be deleted immediately after logout. This action can't be reverted</p>
        </f7-block>

        <f7-list no-hairlines form>
          <f7-list-input
            type="text"
            name="email"
            placeholder="E-mail"
            v-model:value="nicknamedUserData.email"
          ></f7-list-input>

          <f7-list-input
            type="password"
            name="password"
            placeholder="Password"
            v-model:value="nicknamedUserData.password"
          ></f7-list-input>

          <f7-list-input
            type="password"
            name="password"
            placeholder="Confirm password"
            v-model:value="nicknamedUserData.confirmPassword"
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
import {reactive, ref} from 'vue';
import {storeToRefs} from 'pinia';
import {useAuthStore} from '@/js/stores/auth';
import {f7} from 'framework7-vue';

const props = defineProps({
  f7router: Object
})

const settingsItems = [
  {
    href: 'terms',
    title: 'Terms of services'
  },
  {
    href: 'privacy',
    title: 'Privacy'
  },
  {
    href: 'imprint',
    title: 'Imprint'
  },
  {
    href: 'licenses',
    title: 'Software licenses'
  },
  {
    href: 'release-notes',
    title: 'Release notes'
  },
  {
    href: 'feedback',
    title: 'Write a review'
  }
];

const authStore = useAuthStore();
const { user, isNicknamedOnlyUser } = storeToRefs(authStore);
const { logout, updateNicknamedUser, deleteNicknamedUser } = authStore;

const isPopupOpened = ref(false);
const nicknamedUserData = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const logoutHandler = () => {
  if (isNicknamedOnlyUser.value) {
    isPopupOpened.value = true;
    return;
  }

  logoutUser();
};

const logoutUser = () => {
  logout()
    .then(() => {
      props.f7router.navigate('/login/');
    });
}

const nicknamedUserUpdate = () => {
  if (nicknamedUserData.password === nicknamedUserData.confirmPassword) {
    updateNicknamedUser(nicknamedUserData)
      .then(resp => {
        if (resp.status === 'success') {
          isPopupOpened.value = false;
          logoutUser();

          return;
        }

        f7.toast.show({
          text: resp.message,
          closeButton: true
        });
      });

    return;
  }

  f7.toast.show({
    text: 'Password and password confirmation should match',
    closeButton: true
  });
};

const nicknamedUserLogout = () => {
  deleteNicknamedUser()
    .then(resp => {
      if (resp.status === 'success') {
        isPopupOpened.value = false;
        logoutUser();
        return;
      }

      f7.toast.show({
        text: resp.message,
        closeButton: true
      });
    });
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/pages/settings.scss";
</style>
