import { f7 } from "framework7-vue";
import { useAuthStore } from "./stores/auth";

const exceptionUrls = ["notifications"];

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
  const { logout } = useAuthStore();
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
      else if (!exceptionUrls.includes(url.split("?")[0]) && Object.keys(data).length === 0) {
        f7.views.main.router.navigate("/error");
      }
      return data;
    })
    .catch(async err => {
      if (err.status === 401) {
        return await logout().then(() => {
          f7.views.main.router.navigate("/login/");
          return err;
        });
      } else if (!exceptionUrls.includes(url.split("?")[0]) && err.status) {
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
