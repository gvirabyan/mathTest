export default {
  token: localStorage.getItem('user') || '',
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
}