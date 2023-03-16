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

export default fb;
