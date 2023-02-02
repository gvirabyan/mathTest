const defaultOptions = () => {
  let options = {
    headers: {
      'Content-Type': 'application/json'
    },
  };
  if (localStorage.getItem('token')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  }

  return options
}

const get = (url) => fetch(`${import.meta.env.VITE_API_URL}${url}`, defaultOptions());

const post = (url, body) => fetch(`${import.meta.env.VITE_API_URL}${url}`, {
  ...defaultOptions(),
  method: "POST",
  body: JSON.stringify(body)
});

const put = (url, body) => fetch(`${import.meta.env.VITE_API_URL}${url}`, {
  ...defaultOptions(),
  method: "PUT",
  body: JSON.stringify(body)
});

const remove = (url) => fetch(`${import.meta.env.VITE_API_URL}${url}`, {
  ...defaultOptions(),
  method: "DELETE",
})

export default {
  get,
  post,
  put,
  remove
};
