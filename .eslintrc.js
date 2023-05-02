module.exports = {
  env: {
    node: true,
  },
  extends: ["eslint:recommended", "plugin:vue/vue3-recommended", "prettier"],
  plugins: ["vue", "prettier"],
  rules: {
    // override/add rules settings here, such as:
    "prettier/prettier": "warn",
    "no-unused-vars": [
      "warn",
      {
        args: "none",
      },
    ],
    "no-unsafe-optional-chaining": "off",
    "vue/no-v-html": "off",
    "vue/no-unused-vars": "warn",
    "vue/multi-word-component-names": "off",
  },
};
