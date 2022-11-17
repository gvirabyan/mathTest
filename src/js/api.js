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

const get = (url) => fetch(`http://localhost:1337/api/${url}`, defaultOptions());

const post = (url, body) => fetch(`http://localhost:1337/api/${url}`, {
  ...defaultOptions(),
  method: "POST",
  body: JSON.stringify(body)
});

export default {
  get,
  post
};
