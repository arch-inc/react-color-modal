import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import { createRequire } from "node:module";
import { copyFileSync, mkdirSync } from "node:fs";

const require = createRequire(import.meta.url);
const pkg = require("./package.json");
const externalPackages = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
];

const comments = function (_node, comment) {
    const { value, type } = comment;
    return type === "comment2" && /@preserve|@license/i.test(value);
  },
  extensions = [".js", ".jsx", ".ts", ".tsx"];

export default [
  {
    input: "lib/index.ts",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        interop: "auto",
      },
      {
        file: pkg.module,
        format: "es",
      },
    ],
    external: (id) =>
      externalPackages.some(
        (packageName) => id === packageName || id.startsWith(`${packageName}/`),
      ),
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        extensions,
        include: "lib/**/*",
        exclude: "node_modules/**/*",
      }),
      terser({ output: { comments } }),
      {
        name: "copy-library-styles",
        writeBundle() {
          mkdirSync("dist", { recursive: true });
          copyFileSync("lib/styles.css", "dist/styles.css");
        },
      },
    ],
  },
];
