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
  if (prevUrl && prevUrl.split("&")[0] === url.split("&")[0]) {
    if (window.controller) {
      window.controller.abort();
    }
    window.controller = new AbortController();
    window.signal = window.controller.signal;
  }
  prevUrl = url;
  const request = await fetch(`${import.meta.env.VITE_API_URL}${url}`, { signal: window.signal, ...defaultOptions() });
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
