import HomePage from "../pages/home.vue";
import Activity from "../pages/activity.vue";
import NotFound from "@/pages/not-found.vue";
import { useAuthStore } from "./stores/auth";
import { storeToRefs } from "pinia/dist/pinia";

async function checkAuth({ to, from, resolve, reject }) {
  const store = useAuthStore();
  const token = localStorage.getItem("token");
  const { getUser } = store;
  const { user } = storeToRefs(store);
  if (token && !user.value) {
    await getUser();
  }
  if (
    ["Register", "Login", "ForgotPassword", "ResetPassword", "Home", "ProviderLoginRedirect"].includes(to.name) &&
    token &&
    user.value
  ) {
    reject();
    this.navigate("/activity/");
  } else if (
    !["Register", "Login", "ForgotPassword", "ResetPassword", "Home", "ProviderLoginRedirect"].includes(to.name) &&
    (!token || !user.value)
  ) {
    reject();
    this.navigate("/login/");
  } else {
    resolve();
  }
}

function checkSecurity({ to, from, resolve, reject }) {
  const store = useAuthStore();
  const { passwords } = store;
  const { changeSecurityPath } = store;
  const { securityLeavePopup } = storeToRefs(store);
  if (passwords.confirmNewPassword || passwords.newPassword) {
    securityLeavePopup.value = true;
    changeSecurityPath(to.path);
    reject();
  } else {
    resolve();
  }
}

function checkAccount({ to, from, resolve, reject }) {
  const store = useAuthStore();
  const { changeAccountPath } = store;
  const { checkAccountData } = storeToRefs(store);
  const { accountLeavePopup } = storeToRefs(store);
  if (checkAccountData.value) {
    changeAccountPath(to.path);
    accountLeavePopup.value = true;
    reject();
  } else {
    resolve();
  }
}

let redirectTimes = "";

function playAudio({ to, from, resolve }) {
  const store = useAuthStore();
  const { user } = storeToRefs(store);
  if (redirectTimes !== to.url && to.url && Object.keys(from).length && user.value && user.value.sound) {
    redirectTimes = to.url;
    const redirect = new Audio("audios/redirect.wav");
    redirect.pause();
    redirect.currentTime = 0;
    redirect.volume = Number(user.value.volume_sound) / 100;
    redirect.play();
  }
  resolve();
}

const routes = [
  {
    path: "/",
    beforeEnter: playAudio,
    async({ resolve }) {
      const userId = localStorage.getItem("user-id");
      const token = localStorage.getItem("token");
      if (token && userId) {
        resolve({
          name: "Activity",
          component: Activity,
        });
      } else {
        resolve({
          name: "Home",
          component: HomePage,
        });
      }
    },
  },
  {
    path: "/home/",
    name: "Home",
    component: HomePage,
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/login/",
    name: "Login",
    asyncComponent: () => import("../pages/login.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/register/",
    name: "Register",
    asyncComponent: () => import("../pages/register.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/forgot-password/",
    name: "ForgotPassword",
    asyncComponent: () => import("../pages/forgot-password.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/reset-password/",
    name: "ResetPassword",
    asyncComponent: () => import("../pages/reset-password.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/activity/",
    name: "Activity",
    component: Activity,
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/topics/",
    name: "Topics",
    asyncComponent: () => import("../pages/topics.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/practice/",
    name: "Practice",
    asyncComponent: () => import("../pages/practice.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/player-vs-machine-questions/:modeID/",
    name: "PlayerVsMachineQuiz",
    asyncComponent: () => import("../pages/player-vs-machine-quiz.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/categories/:categoryID/questions",
    name: "Question",
    asyncComponent: () => import("../pages/question.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/profile/about-us/",
    name: "AboutUs",
    beforeEnter: [checkAuth, playAudio],
    asyncComponent: () => import("../pages/about-us.vue"),
  },
  {
    path: "/profile/security/",
    name: "Security",
    asyncComponent: () => import("../pages/security.vue"),
    beforeEnter: [checkAuth, playAudio],
    beforeLeave: checkSecurity,
  },
  {
    path: "/profile/account/",
    name: "Account",
    asyncComponent: () => import("../pages/account.vue"),
    beforeEnter: [checkAuth, playAudio],
    beforeLeave: checkAccount,
  },
  {
    path: "/profile/send-reports",
    name: "Send reports",
    asyncComponent: () => import("../pages/send-reports.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/profile/profile-sound",
    name: "Send reports",
    asyncComponent: () => import("../pages/profile-sound.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/my-stats/",
    name: "MyStats",
    asyncComponent: () => import("../pages/my-stats.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/top-lists/",
    name: "TopLists",
    asyncComponent: () => import("../pages/top-lists.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/top-list/:filterName/list",
    name: "TopList",
    asyncComponent: () => import("../pages/top-list.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/",
    name: "Settings",
    asyncComponent: () => import("../pages/settings.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/update-password",
    name: "Update password",
    asyncComponent: () => import("../pages/update-password.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/terms",
    name: "Terms of services",
    asyncComponent: () => import("../pages/terms.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/privacy",
    name: "Privacy",
    asyncComponent: () => import("../pages/privacy.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/imprint",
    name: "Imprint",
    asyncComponent: () => import("../pages/imprint.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/licenses",
    name: "Licenses",
    asyncComponent: () => import("../pages/licenses.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/release-notes",
    name: "Release notes",
    asyncComponent: () => import("../pages/release-notes.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/settings/feedback",
    name: "Write a review",
    asyncComponent: () => import("../pages/feedback.vue"),
    beforeEnter: [checkAuth, playAudio],
  },
  {
    path: "/about/",
    asyncComponent: () => import("../pages/about.vue"),
    beforeEnter: playAudio,
  },
  {
    path: "(.*)",
    name: "NotFound",
    component: NotFound,
    beforeEnter: playAudio,
    keepAlive: true,
  },
];

export default routes;
