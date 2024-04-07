const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: "./spraEditor.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "spraEditor.js",
    publicPath: "https://violetevergdev.github.io/SPRA-Replacer/"
  },
  target: "node",
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: `public` }],
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
};
