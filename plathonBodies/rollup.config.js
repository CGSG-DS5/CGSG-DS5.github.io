const babel = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");

const uglify = require("rollup-plugin-uglify");

module.exports = {
  input: "src/main.js",
  output: {
    dir: "dist",
    format: "iife",
    // sourcemap: "inline",
  },
  plugins: [
    resolve({
      jsnext: true,
      main: true,
      browser: true,
    }),
    commonjs(),
    babel({
      exclude: ["node_modules/**", "bin/**"],
    }),
    uglify.uglify(),
  ],
};
