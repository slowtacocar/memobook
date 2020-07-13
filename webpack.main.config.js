const path = require('path')

module.exports = {
  entry: './src/main.js',
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
        }, {
          loader: 'eslint-loader',
          options: {
            configFile: '.eslintrc.main.json'
          }
        }]
      }
    ]
  }
}
