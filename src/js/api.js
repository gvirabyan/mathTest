const defaultOptions = {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
};

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
