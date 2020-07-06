import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";

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
      },
      {
        file: pkg.module,
        format: "es",
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      resolve({ extensions }),
      commonjs(),
      babel({ extensions, include: "lib/**/*", exclude: "node_modules/**/*" }),
      terser({ output: { comments } }),
    ],
  },
];
