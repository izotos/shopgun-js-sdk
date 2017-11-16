import coffeescript from "rollup-plugin-coffee-script";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";
import path from "path";
import { minify } from "uglify-es";
import babel from "rollup-plugin-babel";
import globals from 'rollup-plugin-node-globals';

var input = path.join(__dirname, "lib", "coffeescript", "index.coffee");

var outputs = {
  // Exclusive bundles(external `require`s untouched), for node, webpack etc.
  CJS: path.join(__dirname, "dist", "sgn-sdk.cjs.js"), // CommonJS
  ES: path.join(__dirname, "dist", "sgn-sdk.es.js"), // ES Module
  // Inclusive bundles(external `require`s resolved), for browsers etc.
  UMD: path.join(__dirname, "dist", "sgn-sdk.js"),
  UMDMin: path.join(__dirname, "dist", "sgn-sdk.min.js"),
};

export default [
  {
    input,
    output: {
      file: outputs.CJS,
      format: "cjs"
    },
    plugins: [
      coffeescript(),
      commonjs({
        extensions: [".js", ".coffee"]
      }),
      babel()
    ]
  },
  {
    input,
    output: {
      file: outputs.ES,
      format: "es"
    },
    plugins: [
      coffeescript(),
      commonjs({
        extensions: [".js", ".coffee"]
      }),
      babel()
    ]
  },
  {
    input,
    output: {
      file: outputs.UMD,
      format: "umd",
      name: "SGN"
    },
    plugins: [
      coffeescript(),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        extensions: [".js", ".coffee"]
      }),
      globals(),
      babel(),
      filesize(),
    ]
  },
  {
    input,
    output: {
      file: outputs.UMDMin,
      format: "umd",
      name: "SGN"
    },
    plugins: [
      coffeescript(),
      resolve({
        jsnext: true,
        main: true,
        browser: true,
        preferBuiltins: false
      }),
      commonjs({
        extensions: [".js", ".coffee"]
      }),
      globals(),
      babel(),
      uglify({}, minify),
      filesize(),
    ]
  }
];
