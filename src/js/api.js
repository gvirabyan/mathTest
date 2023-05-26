import { f7 } from "framework7-vue";
import { useAuthStore } from "./stores/auth";
import { storeToRefs } from "pinia/dist/pinia";
import configData from "../../config";

const { exceptionUrls } = configData;
const defaultOptions = () => {
  let options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (localStorage.getItem("token")) {
    options.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  }
  return options;
};

let prevUrl = "";
const get = async url => {
  const authStore = useAuthStore();
  const { checkLogout } = storeToRefs(authStore);
  const { logout } = authStore;
  if (prevUrl && prevUrl.split("&")[0] === url.split("&")[0]) {
    if (window.controller) {
      window.controller.abort();
    }
    window.controller = new AbortController();
    window.signal = window.controller.signal;
  }
  prevUrl = url;
  const request = await fetch(`${import.meta.env.VITE_API_URL}${url}`, { signal: window.signal, ...defaultOptions() })
    .then(res => res.json())
    .then(data => {
      if (data.error) throw data.error;
      else if (
        !exceptionUrls.includes(url.split("?")[0].split("/").reverse()[0]) &&
        Object.keys(data).length === 0 &&
        checkLogout.value
      ) {
        f7.views.main.router.navigate("/error");
      }
      return data;
    })
    .catch(async err => {
      if (err.status === 401) {
        checkLogout.value = false;
        return await logout().then(() => {
          f7.views.main.router.navigate("/login/");
          return err;
        });
      } else if (
        !exceptionUrls.includes(url.split("?")[0]) &&
        err.message.indexOf("aborted") === -1 &&
        checkLogout.value
      ) {
        f7.views.main.router.navigate("/error");
      }
      return err;
    });
  return request;
};

const post = (url, body) =>
  fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...defaultOptions(),
    method: "POST",
    body: JSON.stringify(body),
  });

const put = (url, body) =>
  fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...defaultOptions(),
    method: "PUT",
    body: JSON.stringify(body),
  });

const remove = url =>
  fetch(`${import.meta.env.VITE_API_URL}${url}`, {
    ...defaultOptions(),
    method: "DELETE",
  });
export default {
  get,
  post,
  put,
  remove,
};
