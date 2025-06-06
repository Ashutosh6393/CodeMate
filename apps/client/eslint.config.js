import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  globalIgnores([
    "dist/**/*", // ignore all contents in and under `build/` directory but not the `build/` directory itself
    "!dist/test.js", // unignore `!build/test.js`
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "prettier/prettier": ["error"],
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },

  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "jsx-quotes": ["error", "prefer-double"],
      "react/react-in-jsx-scope": "off",
    },
  },
  eslintPluginPrettier,
]);
