const rules = require("./webpack.rules");

rules.push({
  test: /\.(scss)$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: function () {
            return [require("autoprefixer")];
          },
        },
      },
    },
    { loader: "sass-loader" },
  ],
});

module.exports = {
  module: {
    rules,
  },
};
