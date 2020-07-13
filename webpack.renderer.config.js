const StylelintPlugin = require('stylelint-webpack-plugin')

module.exports = {
  plugins: [
    new StylelintPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(m?js|node)$/,
        parser: { amd: false },
        use: [{
          loader: '@marshallofsound/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules',
          },
        }, 'babel-loader', {
          loader: 'eslint-loader',
          options: {
            configFile: '.eslintrc.renderer.json'
          }
        }]
      }, {
        test: /\.(scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  }
}
