const fb = {};

/**
 * Authenticate user with facebook account
 * @param {*} permissions Array of permissions. Default is public_profile and email
 * This method store inside "fb_access_token" local_storage the response
 */
fb.login = async (permissions = ["public_profile", "email"]) => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    facebookConnectPlugin.login(
      permissions,
      function (response) {
        localStorage.setItem("fb_access_token", JSON.stringify(response));
        resolve(response);
      },
      function (error) {
        resolve(error);
      },
    );
  }); // return new Promise()
}; // fb.login

/**
 * Return the facebook status session
 */
fb.get_login_status = async () => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    facebookConnectPlugin.getLoginStatus(
      function (success) {
        resolve(success);
      },
      function (failure) {
        resolve(failure);
      },
    );
  });
}; // get_login_status

/**
 * Returns the access token from local storage
 */
fb.get_local_access_token = async () => {
  const fb_access_token = JSON.parse(localStorage.getItem("fb_access_token"));

  if (fb_access_token["status"] === "connected") return fb_access_token["authResponse"]["accessToken"];

  return "";
};

/**
 * Logout from facebook
 */
fb.logout = async () => {
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-undef
    facebookConnectPlugin.logout(
      function (success) {
        resolve(success);
      },
      function (failure) {
        resolve(failure);
      },
    );
  });
}; // logout

export default fb;
