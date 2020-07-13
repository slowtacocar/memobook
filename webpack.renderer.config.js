const StylelintPlugin = require('stylelint-webpack-plugin')
const path = require('path')

module.exports = {
  plugins: [
    new StylelintPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.node$/,
        include: path.resolve(__dirname, 'src'),
        use: 'node-loader'
      },
      {
        test: /\.(m?js|node)$/,
        include: path.resolve(__dirname, 'src'),
        parser: { amd: false },
        use: [{
          loader: '@marshallofsound/webpack-asset-relocator-loader',
          options: {
            outputAssetBase: 'native_modules'
          }
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
