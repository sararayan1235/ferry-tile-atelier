import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([".wrangler/**", ".next/**", ".open-next/**", "node_modules/**", "coverage/**", ".vercel/**", "design/**", "legacy-pages/**", "cloudflare-env.d.ts"]),
]);
