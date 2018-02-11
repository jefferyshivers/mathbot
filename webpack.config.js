const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: { somebot: "./src/index.js", "somebot.min": "./src/index.js" },
  // devtool: "source-map",
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "build")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
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
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true
    })
  ]
};
