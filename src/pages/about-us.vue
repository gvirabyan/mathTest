<template>
  <f7-page class="hg-dashboard-content about-us-page" name="dashboard" @page:beforein="getAllData">
    <top-bar :tabs="profileTabs" :search="false" @tab-selected="setProfileComponent" :first-load-index="2">
      <template #title>Profile</template>
      <template #subtitle>Username</template>
    </top-bar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <f7-list>
          <f7-list-item v-for="info in infos" :key="info.title">
            <template #title >
              <f7-button @click="changPopupAboutUs(info.popup)">
                <f7-row class="justify-content-space-between align-items-center">
                  <p class="info-title">{{ info.title }}</p>
                  <img src="@/assets/icons/arrow-right.svg" alt="">
                </f7-row>
              </f7-button>
            </template>
          </f7-list-item>
        </f7-list>
      </Transition>
    </main>

    <component
      v-if="popupAboutUs"
      @close="changPopupAboutUs(false)"
      :is="getPopup"
    />

    <bottom-menu :current-path="f7route.path" />
  </f7-page>
</template>

<script setup>
import {ref, reactive, computed} from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/js/stores/auth";
import delay from "@/js/helpers/delay";
import TopBar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import TermsPopup from "@/components/terms-popup.vue";
import PrivacyPopup from "@/components/privacy-popup.vue";
import ImprintPopup from "@/components/imprint-popup.vue";
import SoftwarePopup from "@/components/software-popup.vue";
import ReleasePopup from "@/components/release-popup.vue";
import ReviewPopup from "@/components/review-popup.vue";
const props = defineProps({
  f7route: {
    type: Object,
    default: () => {},
  },
  f7router: Object
});

const authStore = useAuthStore();

const { user } = storeToRefs(authStore);

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
  {
    id: 4,
    name: "Send Reports",
    path: '/profile/send-reports/'
  },
]);

const infos = reactive([
  {
    title: "Terms of services",
    popup: 'TermsPopup'
  },
  {
    title: "Privacy",
    popup: 'PrivacyPopup'
  },
  {
    title: "Imprint",
    popup: 'ImprintPopup'
  },
  {
    title: "Software licenses",
    popup: 'SoftwarePopup'
  },
  {
    title: "Release notes",
    popup: 'ReleasePopup'
  },
  {
    title: "Write a review",
    popup: 'ReviewPopup'
  }
])

const isLoading = ref(false);
const currentActivityComponent = ref(null);

const { getUser } = authStore;
// const { getCategories, getLastCategory, getPastCategories } = categoryStore;
// const { getAnsweredQuestionsCount } = questionsStore;

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

const getAllData = async () => {
  isLoading.value = true;

  await delay();
  await Promise.all([
    getUser(),
  ]);

  isLoading.value = false;
};


const popupAboutUs = ref(false);
const changPopupAboutUs = (value) => {
  popupAboutUs.value = value
}
const getPopup = computed(() => popupAboutUs.value === 'TermsPopup' ? TermsPopup :
  popupAboutUs.value === 'PrivacyPopup' ? PrivacyPopup :
  popupAboutUs.value === 'ImprintPopup' ? ImprintPopup :
  popupAboutUs.value === 'SoftwarePopup' ? SoftwarePopup :
  popupAboutUs.value === 'ReleasePopup' ? ReleasePopup :
  popupAboutUs.value === 'ReviewPopup' ? ReviewPopup : false
)
</script>

<style lang="scss">
@import "../assets/scss/pages/profile";
@import "../assets/scss/pages/about-us";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
