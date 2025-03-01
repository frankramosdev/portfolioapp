import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rules that are too strict for production builds
      "@typescript-eslint/no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_", 
        "varsIgnorePattern": "^_" 
      }],
      "@typescript-eslint/no-explicit-any": "warn", // Downgrade from error to warning
      "react/no-unescaped-entities": "warn", // Downgrade from error to warning
    },
    ignorePatterns: [
      "node_modules/",
      ".next/",
      "out/",
      "public/"
    ]
  }
];

export default eslintConfig;
