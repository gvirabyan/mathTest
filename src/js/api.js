const defaultOptions = {
  headers: {
    'Content-Type': 'application/json'
  },
};
if (localStorage.getItem('token')) {
  defaultOptions.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
}

const get = (url) => fetch(`http://localhost:1337/api/${url}`, defaultOptions);

const post = (url, body) => fetch(`http://localhost:1337/api/${url}`, {
  ...defaultOptions,
  method: "POST",
  body: JSON.stringify(body)
});

export default {
  get,
  post
};
