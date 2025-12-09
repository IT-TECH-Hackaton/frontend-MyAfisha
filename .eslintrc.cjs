module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/strict",
    "plugin:@typescript-eslint/stylistic",
    "plugin:react-hooks/recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "prettier"
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "react", "@typescript-eslint"],
  root: true,
  rules: {
    "react/prop-types": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-undef": "off",
    "no-unused-vars": "off",
    "no-var": "error",
    "no-console": "warn",
    "no-shadow": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-empty-interface": "off",
    "no-empty-function": "off",
    "@typescript-eslint/no-empty-function": "error",
    "@conarti/feature-sliced/absolute-relative": "off",
    "arrow-body-style": ["error", "as-needed"],
    "react/self-closing-comp": ["error", { component: true, html: true }],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports"
      }
    ],
    "no-restricted-imports": [
      "warn",
      {
        patterns: ["../../"]
      }
    ]
  }
};
