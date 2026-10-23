import { builtinModules } from "node:module";

import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    jsPlugins: [{ name: "shadcn", specifier: "@shadcn/lint" }],
    options: { typeAware: true, typeCheck: true },
    plugins: ["eslint", "typescript", "react", "import", "promise", "node"],
    overrides: [
      {
        files: ["src/**"],
        rules: {
          "no-restricted-globals": [
            "error",
            "process",
            "Buffer",
            "require",
            "module",
            "exports",
            "__dirname",
            "__filename",
            "global",
          ],
          "no-restricted-imports": [
            "error",
            {
              paths: [
                ...builtinModules,
                ...builtinModules.map((name) => "node:" + name),
                "electron",
                "electron/main",
                "electron/renderer",
                "electron/common",
              ],
              patterns: ["@/**", "**/apps/**"],
            },
          ],
        },
      },
    ],
  },
  fmt: {
    semi: false,
    singleQuote: true,
    sortPackageJson: true,
    sortScripts: true,
    sortImports: true,
    sortTailwindcss: true,
  },
});
