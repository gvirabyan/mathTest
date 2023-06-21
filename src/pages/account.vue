<template>
  <f7-page
    class="hg-dashboard-content profile-account-page"
    name="dashboard"
    @page:beforein="getAllData"
    @page:afterin="loadFirstTab"
  >
    <topbar ref="topBar" :tabs="profileTabs" :search="false" @tab-selected="setProfileComponent">
      <template #title>{{ $t("profile.profile") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle>{{ $t("top-bar.today-goal") }}</template>
      <template v-if="user && user.everyday_goal" #subtitle-data>{{
        `${user.everyday_goal}  ${$t("top-bar.questions")}`
      }}</template>
    </topbar>

    <main class="profile-tab-content">
      <Transition name="fade">
        <div class="profile-account">
          <f7-list form class="main-list">
            <f7-list-input
              v-model:value="profileData.email"
              type="text"
              name="email"
              class="custom-list-input"
              :label="$t('inputs.E-mail-address')"
            />

            <f7-list-input
              v-model:value="profileData.name"
              type="text"
              name="name"
              class="custom-list-input"
              :label="$t('inputs.name')"
            />

            <f7-list-input
              v-model:value="profileData.surname"
              type="text"
              name="surname"
              class="custom-list-input"
              :label="$t('inputs.surname')"
            />

            <f7-list-input
              v-model:value="profileData.username"
              type="text"
              name="Nickname"
              class="custom-list-input"
              :label="$t('inputs.nickname')"
            />

            <f7-list-input
              v-model:value="dateStr"
              type="text"
              name="date"
              class="custom-list-input"
              :label="$t('inputs.date-of-birth')"
              :readonly="isCalendarOpened"
              @focus="openCalendar"
            />
            <f7-list-input
              v-model:value="profileData.country"
              type="text"
              name="country"
              class="custom-list-input country-autocomplete"
              :label="$t('inputs.country')"
              @focus="initAutocompleteInputs"
              @input="updateCountry"
              @input:clear="updateCountry"
            />

            <f7-list-input
              v-model:value="profileData.city"
              type="text"
              name="city"
              class="custom-list-input city-autocomplete"
              :label="$t('inputs.city')"
              @focus="initAutocompleteInputs"
              @input="updateCity"
              @input:clear="updateCity"
            />

            <f7-list-input
              v-model:value="profileData.institution.name"
              type="text"
              name="education"
              class="custom-list-input institution-autocomplete"
              :label="$t('inputs.educational-institution')"
              @focus="initAutocompleteInputs"
              @input="setCourseInputValid"
            />
            <f7-list-input
              id="coursesInput"
              v-model:value="profileData.course"
              v-click-out-side="closeDropdown"
              class="courses-input custom-list-input"
              :label="$t('inputs.class/course')"
              type="text"
              :placeholder="$t('inputs.your-class/course')"
              clear-button
              error-message="Please fill your school/university/college before class/course"
              :error-message-force="showCourseErrorMsg"
              @input="setCourseInputValid"
              @focus="openDropdown"
              @click="openDropdown"
            >
            </f7-list-input>
            <f7-button class="log-out-btn" @click="logoutHandler">
              <p>{{ $t("profile.account.log-out") }}</p>
            </f7-button>
          </f7-list>
          <f7-block class="save-btn-block">
            <f7-button class="button-save button-large" @click="updateProfile">{{ $t("buttons.save") }}</f7-button>
            <p class="error-message">{{ errorMessage }}</p>
          </f7-block>
          <div
            v-if="courses && isCoursesDropdown && coursesCurrent.length"
            class="courses-list"
            :style="{ top: topCoursesLists }"
          >
            <f7-button
              v-for="(course, index) in coursesCurrent"
              :key="`course-item_${index + 1}`"
              :text="course"
              @click="selectCourse(course)"
            />
          </div>
        </div>
      </Transition>
    </main>

    <div v-if="isCalendarOpened" class="date-popup" @click="closeCalendar">
      <date-picker v-model="profileData.dateOfBirth" :max-date="new Date()" @click.stop />
    </div>

    <success-message-popup
      v-if="successPopup"
      :title="$t('profile.send-reports.successfully-updated')"
      @close="closeSuccessPopup"
    />

    <leave-page-popup
      v-if="accountLeavePopup"
      @leave-changes="discardChanges"
      @save-changes="updateProfile"
      @close="closeLeavePopup"
    />

    <bottom-menu :current-path="f7route.path" />
    <f7-popup class="logout-popup" swipe-to-close :opened="isPopupOpened" @popup:closed="isPopupOpened = false">
      <f7-page>
        <f7-block class="logout-popup-header">
          <f7-link class="x-icon" popup-close>
            <img src="@/assets/icons/x.svg" />
          </f7-link>
          <f7-block-title>{{ $t("profile.account.logout-warning") }}</f7-block-title>
        </f7-block>
        <div class="scrolling-box">
          <f7-block>
            <p>{{ $t("profile.account.logout-text") }}</p>
          </f7-block>
          <f7-list no-hairlines form>
            <f7-list-input
              v-model:value="nicknamedUserData.email"
              class="custom-list-input"
              type="text"
              name="email"
              :placeholder="$t('inputs.E-mail')"
              :error-message="nicknamedUserDataError.email"
              :error-message-force="true"
            ></f7-list-input>

            <f7-list-input
              v-model:value="nicknamedUserData.password"
              class="custom-list-input"
              type="password"
              name="password"
              :placeholder="$t('inputs.password')"
              :error-message="nicknamedUserDataError.password"
              :error-message-force="true"
            ></f7-list-input>

            <f7-list-input
              v-model:value="nicknamedUserData.confirmPassword"
              class="custom-list-input"
              type="password"
              name="password"
              :placeholder="$t('inputs.confirm password')"
              :error-message="nicknamedUserDataError.confirmPassword"
              :error-message-force="true"
            ></f7-list-input>
          </f7-list>
        </div>
        <f7-block class="logout-popup-footer-block">
          <f7-button class="mb-8 save-btn" @click="nicknamedUserUpdate">{{
            $t("profile.account.save-and-logout")
          }}</f7-button>
          <f7-button class="delete-btn" @click="nicknamedUserLogout">{{
            $t("profile.account.delete-account")
          }}</f7-button>
          <p class="error-message">{{ errMessageNicknamed }}</p>
        </f7-block>
      </f7-page>
    </f7-popup>
  </f7-page>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { DatePicker } from "v-calendar";
import { clickOutSide as vClickOutSide } from "@mahdikhashan/vue3-click-outside";
import { useAuthStore } from "@/js/stores/auth";
import { useCoursesStore } from "@/js/stores/courses";
import { useCategoryAnswerStore } from "@/js/stores/category-answer";
import { useCategoryStore } from "@/js/stores/categories";
import { useNotifications } from "@/js/stores/notifications";
import { useQuizStore } from "@/js/stores/quiz";
import { useParentsEmailsStore } from "@/js/stores/parents-emails";
import { useTopListStore } from "@/js/stores/top-list";
import { useQuestionsStore } from "@/js/stores/questions";
import { useCategoryClassesStore } from "@/js/stores/category-classes";
import { useUserStats } from "@/js/stores/user-stats";
import { getCountryCode } from "@/js/helpers/country-name-to-iso";
import delay from "@/js/helpers/delay";

import Topbar from "@/components/topbar.vue";
import BottomMenu from "@/components/bottom-menu.vue";
import SuccessMessagePopup from "@/components/success-message-popup.vue";
import LeavePagePopup from "@/components/leave-page-popup.vue";

import "v-calendar/dist/style.css";

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

const isCoursesDropdown = ref(false);
const topCoursesLists = ref(0);
const openDropdown = () => {
  topCoursesLists.value = `${document.getElementById("coursesInput").getBoundingClientRect().top + 53}px`;
  isCoursesDropdown.value = true;
};

const closeDropdown = () => {
  isCoursesDropdown.value = false;
};

const selectCourse = course => {
  profileData.course = course;
  isCoursesDropdown.value = false;
};

const authStore = useAuthStore();
const coursesStore = useCoursesStore();
const { updateUser } = authStore;
const { courses } = storeToRefs(coursesStore);
const { getCourses } = coursesStore;
const { user } = storeToRefs(authStore);
const { isNicknamedOnlyUser } = storeToRefs(authStore);
const { changeCheckAccountData } = authStore;
const dateStr = ref(null);
const successPopup = ref(false);
const countryCode = computed(() => (profileData.country !== "" ? getCountryCode(profileData.country) : null));

const coursesCurrent = computed(() => {
  return profileData.course ? courses.value.filter(c => c.indexOf(profileData.course) !== -1) : courses.value;
});

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

const topBar = ref(null);

const loadFirstTab = () => {
  topBar.value.selectFirstTab(profileTabs.value, false);
};

const profileData = reactive({
  email: "",
  name: "",
  surname: "",
  username: "",
  dateOfBirth: new Date().setFullYear(new Date().getFullYear() - 10),
  country: "",
  city: "",
  institution: {
    name: "",
    place_id: "",
  },
  course: "",
});

const checkOutSideClick = ref(true);
watch(
  () => profileData.course,
  v => {
    checkOutSideClick.value = true;
    if (courses.value && courses.value.find(c => c === v)) {
      isCoursesDropdown.value = false;
    }
  },
);

const errorMessage = ref("");
let placeIdOld = null;
watch(
  () => profileData.institution,
  val => {
    courses.value = [];
    val.place_id && val.place_id !== placeIdOld && getCourses(val.place_id);
    placeIdOld = val.place_id;
  },
  { deep: true },
);

const initAutocompleteInputs = () => {
  // remove all autocomplete dropdowns
  const pacContainers = document.querySelectorAll(".pac-container");
  pacContainers.forEach(c => c.remove());

  // init autocomplete on inputs
  const autocompleteClasses = ["country", "city", "institution"];

  for (const elName of autocompleteClasses) {
    // eslint-disable-next-line no-undef
    const autocomplete = new google.maps.places.Autocomplete(document.querySelector(`.${elName}-autocomplete input`));

    elName === "country" && autocomplete.setTypes(["country"]);
    elName === "city" && autocomplete.setTypes(["(cities)"]);
    elName === "institution" && autocomplete.setTypes(["university", "primary_school", "secondary_school", "school"]);

    countryCode.value &&
      autocomplete.setComponentRestrictions({
        // restrict the country
        country: countryCode.value,
      });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const countryValue = place.address_components.filter(c => c.types.includes("country"))[0]?.long_name;
      const cityValue = place.address_components.filter(c => c.types.includes("locality"))[0]?.long_name;

      if (elName === "institution") {
        profileData.institution.name = place.name;
        profileData.institution.place_id = place.place_id;
      } else {
        profileData[elName] = place.name;
      }

      if (countryValue) {
        profileData.country = countryValue;
      }

      if (cityValue) {
        profileData.city = cityValue;
      }
    });
  }
};

const updateProfile = () => {
  accountLeavePopup.value = false;
  errorMessage.value = "";
  if (showCourseErrorMsg.value) {
    errorMessage.value = "Fill all of the inputs correctly";
    return;
  }

  // disableSubmit.value = true;

  updateUser(profileData).then(res => {
    if (res.status === "success") {
      checkAccountData.value = false;
      successPopup.value = true;
      return;
    }
    errorMessage.value = res.message;
  });
  // .finally(() => (disableSubmit.value = false));
  initAutocompleteInputs();
};

const { accountLeavePopup } = storeToRefs(authStore);
const { accountPath } = storeToRefs(authStore);

function closeLeavePopup() {
  accountLeavePopup.value = false;
}

function discardChanges() {
  if (accountPath.value) {
    changeCheckAccountData(false);
    accountLeavePopup.value = false;
    props.f7router.navigate(accountPath.value);
    accountPath.value = "";
  }
}

const updateCountry = () => {
  profileData.city = "";
  profileData.institution = {
    name: "",
    place_id: "",
  };
  profileData.course = "";
};

const updateCity = () => {
  profileData.institution = {
    name: "",
    place_id: "",
  };
  profileData.course = "";
};
const showCourseErrorMsg = ref(false);
const setCourseInputValid = e => {
  if (e.target.value) {
    showCourseErrorMsg.value = !profileData.institution.name;
    return;
  }

  showCourseErrorMsg.value = false;
};

onMounted(() => {
  // fill profile data with initial values
  Object.keys(profileData).forEach(key => {
    if (key === "institution") {
      profileData.institution.name = user?.value[key] ? user?.value[key].name : "";
      profileData.institution.place_id = user?.value[key] ? user?.value[key].place_id : "";
    } else {
      profileData[key] = user?.value[key] || null;
    }
  });

  initAutocompleteInputs();
});

function closeSuccessPopup() {
  if (accountPath.value) {
    changeCheckAccountData(false);
    props.f7router.navigate(accountPath.value);
  }
  successPopup.value = false;
}

watch(countryCode, val => {
  val && initAutocompleteInputs();
});

watch(
  () => user.value,
  val => {
    if (val && val.dateOfBirth) {
      setProfileDate(val.dateOfBirth);
    }
  },
  {
    deep: true,
  },
);

const isCalendarOpened = ref(false);

const openCalendar = () => {
  isCalendarOpened.value = true;
};

const closeCalendar = () => {
  isCalendarOpened.value = false;
};

function setProfileDate(val) {
  if (val && val instanceof Date) {
    // date formatting
    dateStr.value = val.toISOString().slice(0, 10).split("-").reverse().join("/");
    isCalendarOpened.value = false;
  } else if (val && typeof val === "string") {
    dateStr.value = val.slice(0, 10).split("-").reverse().join("/");
  }
}

watch(
  () => profileData.dateOfBirth,
  val => {
    if (val && val instanceof Date) {
      // date formatting
      dateStr.value = val.toISOString().slice(0, 10).split("-").reverse().join("/");
      isCalendarOpened.value = false;
    }
  },
  {
    immediate: true,
  },
);
const { checkAccountData } = storeToRefs(authStore);
let changeSecondTime = 0;
watch(
  () => profileData,
  val => {
    ++changeSecondTime;
    if (changeSecondTime > 2) {
      changeCheckAccountData(true);
    }
  },
  {
    deep: true,
  },
);

const isLoading = ref(false);

const { logout, updateNicknamedUser, deleteNicknamedUser, getUser } = authStore;

const isPopupOpened = ref(false);

const storeQuestion = useQuestionsStore();
const storeTop = useTopListStore();
const storeEmails = useParentsEmailsStore();
const storeQuiz = useQuizStore();
const storeNotification = useNotifications();
const storeCategory = useCategoryStore();
const storeCategoryAnswer = useCategoryAnswerStore();
const storeClassesStore = useCategoryClassesStore();
const storeUserStats = useUserStats();

const logoutHandler = () => {
  if (isNicknamedOnlyUser.value) {
    isPopupOpened.value = true;
    return;
  }
  logoutUser();
};

const logoutUser = () => {
  logout().then(() => {
    coursesStore.$reset();
    authStore.$reset();
    storeCategoryAnswer.$reset();
    storeCategory.$reset();
    storeNotification.$reset();
    storeQuiz.$reset();
    storeEmails.$reset();
    storeTop.$reset();
    storeQuestion.$reset();
    storeUserStats.$reset();
    storeClassesStore.$reset();
    props.f7router.navigate("/login/");
  });
};

const setProfileComponent = id => {
  props.f7router.navigate(profileTabs.value.find(t => t.id === id).path);
};

const getAllData = async () => {
  isLoading.value = true;

  await delay();
  await Promise.all([getUser()]);

  isLoading.value = false;
};

const nicknamedUserData = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const nicknamedUserDataError = reactive({
  email: "",
  password: "",
  confirmPassword: "",
});

const errMessageNicknamed = ref("");

const nicknamedUserUpdate = () => {
  errMessageNicknamed.value = "";
  nicknamedUserDataError.email = "";
  nicknamedUserDataError.password = "";
  nicknamedUserDataError.confirmPassword = "";
  if (nicknamedUserData.password === nicknamedUserData.confirmPassword) {
    updateNicknamedUser(nicknamedUserData).then(resp => {
      if (resp.status === "success") {
        checkAccountData.value = false;
        isPopupOpened.value = false;
        logoutUser();
        return;
      }
      resp.details.errors.forEach(err => {
        nicknamedUserDataError[err.path[0]] = err.message;
      });
    });

    return;
  }
  errMessageNicknamed.value = "Password and password confirmation should match";
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

onMounted(() => {
  document.addEventListener("backbutton", onBackKeyDown, false);
});

function onBackKeyDown() {
  if (successPopup.value || accountLeavePopup.value) {
    successPopup.value = false;
    accountLeavePopup.value = false;
    return false;
  }
  props.f7router.back();
}
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
.pac-container {
  border: 1px solid #e4e4e4;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  margin-top: 10px;
  padding: 8px;
  font-family: Rubik;
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  .pac-item {
    padding: 8px;
    border-top: none;
    border-radius: 5px;
    line-height: 16px;
    &:hover {
      background: #f1e5ff;
    }
    .pac-icon {
      display: none;
    }
  }
}
</style>
