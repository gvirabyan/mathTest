module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  rules: {
    // override/add rules settings here, such as:
    "no-unused-vars": [
      "error",
      {
        args: "none",
      },
    ],
    "no-unsafe-optional-chaining": "off",
    "vue/no-unused-vars": "warn",
    "vue/multi-word-component-names": "off",
  },
};
