const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: process.env.NODE_ENV || "production",

  // entry: { sweetbot: "./src/index.js", "sweetbot.min": "./src/index.js" },
  entry: { somebot: "./src/index.jsx" },

  // devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
    libraryTarget: "var",
    library: "Sweetbot"
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["env", "react", "stage-2"]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true
  }
  // plugins: [
  // new config.optimization.minimize({
  // include: /\.min\.js$/,
  // include: /\.js$/
  // minimize: true,
  // mangle: true
  // })
  // new webpack.DefinePlugin({
  //   "process.env.NODE_ENV": JSON.stringify("production")
  // })
  // ]
};
