import HomePage from "../pages/home.vue";
import Activity from "../pages/activity.vue";
// import LoadingPage from "../components/loading.vue";

function checkAuth({ to, from, resolve, reject }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (
    ["Register", "Login", "ForgotPassword", "ResetPassword", "Home", "ProviderLoginRedirect"].includes(to.name) &&
    token &&
    user
  ) {
    reject();
    this.navigate("/activity/");
  } else if (
    !["Register", "Login", "ForgotPassword", "ResetPassword", "Home", "ProviderLoginRedirect"].includes(to.name) &&
    (!token || !user)
  ) {
    reject();
    this.navigate("/login/");
  } else {
    resolve();
  }
}

const routes = [
  {
    path: "/",
    async({ resolve }) {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
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
    path: "/home",
    name: "Home",
    component: HomePage,
    beforeEnter: checkAuth,
  },
  {
    path: "/login/",
    name: "Login",
    asyncComponent: () => import("../pages/login.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/register/",
    name: "Register",
    asyncComponent: () => import("../pages/register.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/forgot-password/",
    name: "ForgotPassword",
    asyncComponent: () => import("../pages/forgot-password.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/reset-password/",
    name: "ResetPassword",
    asyncComponent: () => import("../pages/reset-password.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/activity/",
    name: "Activity",
    component: Activity,
    beforeEnter: checkAuth,
  },
  {
    path: "/topics/",
    name: "Topics",
    asyncComponent: () => import("../pages/topics.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/practice/",
    name: "Practice",
    asyncComponent: () => import("../pages/practice.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/player-vs-machine-questions/:modeID/",
    name: "PlayerVsMachineQuiz",
    asyncComponent: () => import("../pages/player-vs-machine-quiz.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/categories/:categoryID/questions",
    name: "Question",
    asyncComponent: () => import("../pages/question.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/profile/",
    name: "Profile",
    asyncComponent: () => import("../pages/profile.vue"),
    beforeEnter: checkAuth,
    detailRoutes: [
      {
        path: "/profile/about-us/",
        asyncComponent: () => import("../pages/about-us.vue"),
      },
      {
        path: "/profile/security/",
        asyncComponent: () => import("../pages/security.vue"),
        beforeLeave: function ({ resolve, reject }) {
          resolve();
        }
      },
      {
        path: "/profile/account/",
        asyncComponent: () => import("../pages/account.vue"),
      }
    ],
  },
  {
    path: "/profile2/",
    name: "Profile2",
    asyncComponent: () => import("../pages/profile2.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/my-stats/",
    name: "MyStats",
    asyncComponent: () => import("../pages/my-stats.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/top-lists/",
    name: "TopLists",
    asyncComponent: () => import("../pages/top-lists.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/top-list/:filterName/list",
    name: "TopList",
    asyncComponent: () => import("../pages/top-list.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/",
    name: "Settings",
    asyncComponent: () => import("../pages/settings.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/update-password",
    name: "Update password",
    asyncComponent: () => import("../pages/update-password.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/terms",
    name: "Terms of services",
    asyncComponent: () => import("../pages/terms.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/privacy",
    name: "Privacy",
    asyncComponent: () => import("../pages/privacy.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/imprint",
    name: "Imprint",
    asyncComponent: () => import("../pages/imprint.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/licenses",
    name: "Licenses",
    asyncComponent: () => import("../pages/licenses.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/release-notes",
    name: "Release notes",
    asyncComponent: () => import("../pages/release-notes.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/feedback",
    name: "Write a review",
    asyncComponent: () => import("../pages/feedback.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/settings/send-reports",
    name: "Send reports",
    asyncComponent: () => import("../pages/send-reports.vue"),
    beforeEnter: checkAuth,
  },
  {
    path: "/about/",
    asyncComponent: () => import("../pages/about.vue"),
  },
  {
    path: "(.*)",
    asyncComponent: () => import("../pages/not-found.vue"),
  },
];

export default routes;
