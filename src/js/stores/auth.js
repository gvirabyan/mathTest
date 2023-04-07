import { computed, reactive, ref, watch } from "vue";
import { defineStore } from "pinia";
import api from "@/js/api";

export const useAuthStore = defineStore("auth", () => {
  // state properties
  const token = ref(localStorage.getItem("user") || "");
  const user = ref(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
  const suggestedCredentials = reactive(
    localStorage.getItem("suggestedCredentials")
      ? JSON.parse(localStorage.getItem("suggestedCredentials"))
      : { suggestedLogin: "", suggestedPassword: "" },
  );

  // for security page
  const checkPassSave = ref(false);
  const securityLeavePopup = ref(false)
  const securityPath = ref('');
  const passwords = ref({
      newPassword: '',
      confirmNewPassword: ''
  })


  // getters
  const userData = computed(() => user.value);
  const isNicknamedOnlyUser = computed(() => {
    return user.value && user.value?.username && !user.value?.email;
  });

  // actions
  // for security page
  const changeSecurityPath = (data) => {
    securityPath.value = data
  };

  const changePasswords = (data) => {
    passwords.value = data
  };

  const login = async (userData, rememberUser = false) => {
    return api
      .post("auth/local?populate[0]=institution", userData)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          storeJwtAndUser(data);

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
    return api
      .get(`auth/${provider}/callback${accessToken}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          storeJwtAndUser(data);

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
    return api
      .get(`users/${user.value.id}?populate=institution&populate=user_answers`)
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
      .put(`users/${user.value.id}/update-nicknamed-user`, { ...userData })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const deleteNicknamedUser = async () => {
    return api
      .remove(`users/${user.value.id}/delete-nicknamed-user`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          return { status: "success" };
        } else {
          return { status: "error", message: data.error?.message };
        }
      });
  };

  const storeJwtAndUser = data => {
    token.value = data?.jwt;
    user.value = data?.user;
  };

  const logout = async () => {
    token.value = "";
    user.value = null;

    return { status: "success" };
  };

  watch(token, val => {
    if (!val) {
      localStorage.removeItem("token");
      return;
    }

    localStorage.setItem("token", val);
  });

  watch(user, val => {
    if (!val) {
      localStorage.removeItem("user");
      return;
    }

    localStorage.setItem("user", JSON.stringify(val));
  });

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
    token,
    user,
    suggestedCredentials,
    userData,
    isNicknamedOnlyUser,
    passwords,
    checkPassSave,
    securityLeavePopup,
    securityPath,
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
    storeJwtAndUser,
    logout,
  };
});
