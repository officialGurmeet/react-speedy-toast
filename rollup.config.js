import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import terser from "@rollup/plugin-terser";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
const packageJson = require("./package.json");
import url from "@rollup/plugin-url";
import copy from "rollup-plugin-copy";
import rebase from "rollup-plugin-rebase";
export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    makeAbsoluteExternalsRelative: true,
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      postcss(),
      rebase({
        assetFolder: 'assets',
        keepName: true,
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      terser(),
      copy({
        targets: [{ src: "src/assets/*", dest: "dist/assets" }], // Copy images to dist/assets
      }),
      url({
        include: ["**/*.png", "**/*.jpg", "**/*.svg"], // Include image files
        limit: 0, // Ensures images are copied instead of inlined as base64
        publicPath: "/assets/",
        destDir: "dist/assets",
      }),
    ],
    external: ["react", "react-dom"],
  },
  {
    input: "src/index.ts",
    output: [{ file: packageJson.types }],
    plugins: [dts.default()],
    external: [/\.css$/],
  },
];
