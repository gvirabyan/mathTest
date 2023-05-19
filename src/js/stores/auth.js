import { computed, reactive, ref, watch } from "vue";
import { defineStore } from "pinia";
import { useEverydayGoalStore } from "@/js/stores/everyday-goal";
import api from "@/js/api";

export const useAuthStore = defineStore("auth", () => {
  const everydayGoalStore = useEverydayGoalStore();

  // state properties
  const user = ref(null);
  const token = ref(localStorage.getItem("token") ? localStorage.getItem("token") : null);
  const suggestedCredentials = reactive(
    localStorage.getItem("suggestedCredentials")
      ? JSON.parse(localStorage.getItem("suggestedCredentials"))
      : { suggestedLogin: "", suggestedPassword: "" },
  );

  // for security page
  const checkPassSave = ref(false);
  const checkAccountData = ref(false);
  const securityLeavePopup = ref(false);
  const securityPath = ref("");
  const accountLeavePopup = ref(false);
  const accountPath = ref("");
  const passwords = ref({
    newPassword: "",
    confirmNewPassword: "",
  });

  // getters
  const userData = computed(() => user.value);
  const isLoggedIn = computed(() => !!(user.value && token.value));
  const isNicknamedOnlyUser = computed(() => {
    return user.value && user.value?.username && !user.value?.email;
  });

  // actions
  // for security page
  const changeSecurityPath = data => {
    securityPath.value = data;
  };
  const changeSecurityLeavePopup = () => {
    securityLeavePopup.value = !securityLeavePopup.value;
  };

  // for account page
  const changeAccountPath = data => {
    accountPath.value = data;
  };
  const changeAccountLeavePopup = () => {
    accountLeavePopup.value = !securityLeavePopup.value;
  };
  const changeCheckAccountData = value => {
    checkAccountData.value = value;
  };

  const changePasswords = data => {
    passwords.value = data;
  };

  const login = async (userData, rememberUser = false) => {
    return api
      .post("auth/local?populate[0]=institution", userData)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          storeJwtAndUser(data);

          if (!everydayGoalStore.everydayGoal.questionsToGoal && data.user.everyday_goal) {
            everydayGoalStore.setEverydayGoal(data.user.everyday_goal);
          }

          if (rememberUser) {
            suggestedCredentials.suggestedLogin = userData.identifier;
            suggestedCredentials.suggestedPassword = userData.password;
          } else {
            suggestedCredentials.suggestedLogin = "";
            suggestedCredentials.suggestedPassword = "";
          }

          return { status: "success" };
        } else {
          return { status: "error", error: data.error };
        }
      });
  };

  const loginViaProvider = async (provider, accessToken) => {
    return api.get(`auth/${provider}/callback${accessToken}`).then(data => {
      if (!data.error) {
        storeJwtAndUser(data);

        if (!everydayGoalStore.everydayGoal.questionsToGoal && data.user.everyday_goal) {
          everydayGoalStore.setEverydayGoal(data.user.everyday_goal);
        }

        return { status: "success" };
      } else {
        return { status: "error", message: data.error?.message };
      }
    });
  };

  const register = async (userData, rememberUser = false) => {
    return api
      .post("auth/local/register", userData)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          storeJwtAndUser(data);

          if (rememberUser) {
            suggestedCredentials.suggestedLogin = userData.email;
            suggestedCredentials.suggestedPassword = userData.password;
          } else {
            suggestedCredentials.suggestedLogin = "";
            suggestedCredentials.suggestedPassword = "";
          }

          return { status: "success" };
        } else {
          return { status: "error", error: data.error };
        }
      });
  };

  const registerByNickname = async userData => {
    return api
      .post("auth/local/register-nicknamed-user", userData)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          storeJwtAndUser(data);

          return { status: "success" };
        } else {
          return { status: "error", message: data.error };
        }
      });
  };

  const forgotPassword = async email => {
    return api
      .post("auth/forgot-password", { email })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const resetPassword = async resetPasswordData => {
    return api
      .post("auth/reset-password", resetPasswordData)
      .then(res => res.json())
      .then(data => {
        storeJwtAndUser(data);

        if (!data.error) {
          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const getUser = async () => {
    return api.get(`users/${localStorage.getItem("user-id")}?populate=institution&populate=user_answers`).then(data => {
      if (!data.error) {
        user.value = data;

        return { status: "success" };
      } else {
        return { status: "error", message: data.error?.message };
      }
    });
  };

  const updateUser = async userData => {
    return api
      .put(`users/${user.value.id}`, { ...userData })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          user.value = data;

          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const updateNicknamedUser = async userData => {
    return api
      .put(`users/${localStorage.getItem("user-id")}/update-nicknamed-user`, { ...userData })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          return { status: "success" };
        } else {
          return data.error;
        }
      });
  };

  const deleteNicknamedUser = async () => {
    return api
      .remove(`users/${localStorage.getItem("user-id")}/delete-nicknamed-user`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const sendAppInfo = (logout = false) => {
    if (!window.cordova) return;

    const appInfo = {
      app_opened_datetime: new Date(),
      user_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // eslint-disable-next-line no-undef
    WonderPush.getInstallationId(function (installationId) {
      if (logout) {
        appInfo.app_opened_datetime = null;
        appInfo.user_timezone = null;
      }

      return updateUser({ app_info: appInfo, installation: installationId });
    });

    // if (logout) {
    //   appInfo.app_opened_datetime = null;
    //   appInfo.user_timezone = null;
    // }
    //
    // return updateUser({ ...appInfo, installation: "4f740260de319c41ffeda4c05f6769b51b025a6d" });
  };

  const storeJwtAndUser = data => {
    localStorage.setItem("token", data?.jwt);
    localStorage.setItem("user-id", data?.user?.id);
    user.value = data?.user;
  };

  const logout = async () => {
    user.value = null;

    localStorage.removeItem("token");
    localStorage.removeItem("user-id");

    await sendAppInfo(true);

    return { status: "success" };
  };

  watch(
    isLoggedIn,
    value => {
      if (!value) return;

      sendAppInfo();
    },
    { immediate: true },
  );

  watch(
    () => suggestedCredentials,
    val => {
      if (!val.suggestedLogin && !val.suggestedPassword) {
        localStorage.removeItem("suggestedCredentials");
        return;
      }

      localStorage.setItem("suggestedCredentials", JSON.stringify(val));
    },
    { deep: true },
  );

  return {
    user,
    token,
    suggestedCredentials,
    userData,
    isLoggedIn,
    isNicknamedOnlyUser,
    passwords,
    checkPassSave,
    securityLeavePopup,
    accountLeavePopup,
    accountPath,
    checkAccountData,
    securityPath,
    changeCheckAccountData,
    changeAccountPath,
    changeAccountLeavePopup,
    changeSecurityLeavePopup,
    changePasswords,
    changeSecurityPath,
    login,
    loginViaProvider,
    register,
    registerByNickname,
    forgotPassword,
    resetPassword,
    getUser,
    updateUser,
    updateNicknamedUser,
    deleteNicknamedUser,
    sendAppInfo,
    storeJwtAndUser,
    logout,
  };
});
