import react from "@eslint-react/eslint-plugin";
import accessibility from "@htmlacademy/eslint-plugin-jsx-a11y";
import next from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import imports from "eslint-plugin-import-x";
import reactHooks from "eslint-plugin-react-hooks";
import typescript from "typescript-eslint";

export default defineConfig([
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"],
    extends: [
      next.configs["core-web-vitals"],
      react.configs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { import: imports, "jsx-a11y": accessibility },
    rules: {
      "import/no-anonymous-default-export": "warn",
      "jsx-a11y/alt-text": ["warn", { elements: ["img"], img: ["Image"] }],
      "jsx-a11y/aria-props": "warn",
      "jsx-a11y/aria-proptypes": "warn",
      "jsx-a11y/aria-unsupported-elements": "warn",
      "jsx-a11y/role-has-required-aria-props": "warn",
      "jsx-a11y/role-supports-aria-props": "warn",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [typescript.configs.recommended],
  },
  {
    files: ["src/app/components/Footer.tsx"],
    rules: { "@eslint-react/purity": "off" },
  },
  {
    files: ["src/app/components/NotionPost.tsx"],
    // Os trechos de rich text do Notion têm ordem, mas não têm IDs próprios.
    rules: { "@eslint-react/no-array-index-key": "off" },
  },
]);
