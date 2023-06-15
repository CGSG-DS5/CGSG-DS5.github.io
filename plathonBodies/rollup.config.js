const resolve = require("rollup-plugin-node-resolve");
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
    uglify.uglify(),
  ],
};
