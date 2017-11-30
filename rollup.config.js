import coffeescript from "rollup-plugin-coffee-script";
import commonjs from "rollup-plugin-commonjs";
import resolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import filesize from "rollup-plugin-filesize";
import path from "path";
import { minify } from "uglify-es";
import babel from "rollup-plugin-babel";
import globals from "rollup-plugin-node-globals";

var babelConfig = {
  babelrc: false,
  exclude: "node_modules/**",
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: ["> 3%"],
          node: 8
        },
        modules: false,
        useBuiltIns: "usage"
      }
    ]
  ]
};

var inputs = {
  // Long term we want to get rid of the separate entry points and
  // instead have one entry point that behaves properly according to environment.
  node: path.join(__dirname, "lib", "coffeescript", "node.coffee"),
  browser: path.join(__dirname, "lib", "coffeescript", "index.coffee")
};
var outputs = {
  // Exclusive bundles(external `require`s untouched), for node, webpack etc.
  CJS: path.join(__dirname, "dist", "sgn-sdk.cjs.js"), // CommonJS
  ES: path.join(__dirname, "dist", "sgn-sdk.es.js"), // ES Module
  // Inclusive bundles(external `require`s resolved), for browsers etc.
  UMD: path.join(__dirname, "dist", "sgn-sdk.js"),
  UMDMin: path.join(__dirname, "dist", "sgn-sdk.min.js")
};

export default [
  {
    input: inputs.node,
    output: {
      file: outputs.CJS,
      format: "cjs"
    },
    plugins: [
      coffeescript(),
      commonjs({
        extensions: [".js", ".coffee"]
      }),
      babel(babelConfig)
    ]
  },
  {
    input: inputs.node,
    output: {
      file: outputs.ES,
      format: "es"
    },
    plugins: [
      coffeescript(),
      commonjs({
        extensions: [".js", ".coffee"]
      }),
      babel(babelConfig)
    ]
  },
  {
    input: inputs.browser,
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
      babel(babelConfig)
    ]
  },
  {
    input: inputs.browser,
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
      babel(babelConfig),
      uglify({}, minify)
    ]
  }
];
