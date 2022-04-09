const config = {
  // "umabiguous" tells Babel to automatically detect if it's transforming a CJS or ESM file, so that it doesn't inject import statements in CJS dependencies.
  // https://github.com/babel/babel/issues/12731#issuecomment-780153966
  "sourceType": "unambiguous",
  "presets": [
    "@babel/preset-env",
    "@babel/preset-typescript"
  ],
  "plugins": [],
  "ignore": ['./src/utils/MVTImageryProvider/mapbox-gl.js'],
}

if (process.title === "webpack") {
  config.plugins.push("@babel/transform-runtime");
}

module.exports = config;