module.exports = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-recommended-vue",
    "stylelint-config-tailwindcss",
  ],
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen",
          "layer",
        ],
      },
    ],
    "no-descending-specificity": null,
  },
  overrides: [
    {
      files: ["*.vue", "**/*.vue"],
      customSyntax: "postcss-html",
    },
    {
      files: ["assets/css/tailwind.css"],
      customSyntax: "postcss",
      rules: {},
    },
  ],
  ignoreFiles: ["**/coverage/lcov-report/**"],
};
