import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    // 1. Apply this to all your javascript files
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      // Keep this as "module" so it can parse the 'import' statements in this config
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      "no-undef": "error",
      "no-func-assign": "error",
      "no-unused-vars": "warn",
      "consistent-return": "error",
    },
  },
  {
    // 2. Explicitly tell ESLint that your backend files use 'require'
    files: ["backend/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
    },
  },
];
